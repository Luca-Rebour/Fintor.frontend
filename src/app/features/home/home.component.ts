import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgClass, NgFor, NgIf, DecimalPipe, AsyncPipe } from '@angular/common';
import { MovementsChartComponent } from "../../shared/components/movements-chart/movements-chart.component";
import { TransactionsService } from '../../shared/services/transactions.service';
import { TransactionModel } from '../../shared/models/transaction.model';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NgClass, NgFor, NgIf, DecimalPipe, AsyncPipe, MovementsChartComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  
  // Observables del servicio
  transactions$!: Observable<TransactionModel[]>;
  loading$!: Observable<boolean>;
  
  // Propiedades calculadas
  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;
  
  private subscription = new Subscription();

  constructor(private transactionsService: TransactionsService) { }

  ngOnInit() {
    // Inicializar los observables
    this.transactions$ = this.transactionsService.transactions$;
    this.loading$ = this.transactionsService.loading$;

    // Cargar las transacciones al inicializar el componente
    this.subscription.add(
      this.transactionsService.getLatestTransactions().subscribe()
    );

    // Suscribirse a los cambios de transacciones para actualizar los totales
    this.subscription.add(
      this.transactions$.subscribe(transactions => {
        this.updateTotals();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Actualizar los totales basados en las transacciones actuales
  private updateTotals(): void {
    this.totalIncome = this.transactionsService.getTotalIncome();
    this.totalExpenses = this.transactionsService.getTotalExpenses();
    this.balance = this.transactionsService.getBalance();
  }

  // Método para refrescar las transacciones
  refreshTransactions(): void {
    this.transactionsService.refreshTransactions();
  }
  
  // Método para obtener las clases de color de fondo del icono
  getIconBackgroundClass(color: string): string {
    const colorClasses: { [key: string]: string } = {
      'purple': 'bg-purple-100 text-purple-600',
      'blue': 'bg-blue-100 text-blue-600',
      'green': 'bg-green-100 text-green-600',
      'orange': 'bg-orange-100 text-orange-600',
      'emerald': 'bg-emerald-100 text-emerald-600',
      'red': 'bg-red-100 text-red-600',
      'cyan': 'bg-cyan-100 text-cyan-600'
    };
    return colorClasses[color] || 'bg-gray-100 text-gray-600';
  }
}
