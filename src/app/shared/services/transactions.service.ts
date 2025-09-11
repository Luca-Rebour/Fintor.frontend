import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TransactionModel } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  apiUrl = environment.apiUrl;

  // BehaviorSubject para mantener el estado de las transacciones
  private transactionsSubject = new BehaviorSubject<TransactionModel[]>([]);
  
  // Observable público para que los componentes se suscriban
  public transactions$ = this.transactionsSubject.asObservable();

  // BehaviorSubject para mantener el estado de loading
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Getter para obtener el valor actual de las transacciones
  get currentTransactions(): TransactionModel[] {
    return this.transactionsSubject.value;
  }

  // Setter para actualizar las transacciones
  private updateTransactions(transactions: TransactionModel[]): void {
    this.transactionsSubject.next(transactions);
  }

  // Setter para actualizar el estado de loading
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }


  getLatestTransactions(): Observable<TransactionModel[]> {
    this.setLoading(true);
    return this.http.get<TransactionModel[]>(`${this.apiUrl}/transactions/get-latest`).pipe(
      tap({
        next: (transactions) => {
          this.updateTransactions(transactions);
          this.setLoading(false);
        },
        error: () => this.setLoading(false)
      })
    );
  }

  getAllTransactions(): Observable<TransactionModel[]> {
    this.setLoading(true);
    return this.http.get<TransactionModel[]>(`${this.apiUrl}/transactions`).pipe(
      tap({
        next: (transactions) => {
          this.updateTransactions(transactions);
          this.setLoading(false);
        },
        error: () => this.setLoading(false)
      })
    );
  }

  getTransactionById(id: string): Observable<TransactionModel> {
    return this.http.get<TransactionModel>(`${this.apiUrl}/transactions/${id}`);
  }

  createTransaction(transaction: Partial<TransactionModel>): Observable<TransactionModel> {
    return this.http.post<TransactionModel>(`${this.apiUrl}/transactions`, transaction).pipe(
      tap((newTransaction) => {
        // Agregar la nueva transacción al estado actual
        const currentTransactions = this.currentTransactions;
        this.updateTransactions([newTransaction, ...currentTransactions]);
      })
    );
  }

  updateTransaction(id: string, transaction: Partial<TransactionModel>): Observable<TransactionModel> {
    return this.http.put<TransactionModel>(`${this.apiUrl}/transactions/${id}`, transaction).pipe(
      tap((updatedTransaction) => {
        // Actualizar la transacción en el estado actual
        const currentTransactions = this.currentTransactions;
        const index = currentTransactions.findIndex(t => t.id === id);
        if (index !== -1) {
          currentTransactions[index] = updatedTransaction;
          this.updateTransactions([...currentTransactions]);
        }
      })
    );
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`).pipe(
      tap(() => {
        // Remover la transacción del estado actual
        const currentTransactions = this.currentTransactions;
        const filteredTransactions = currentTransactions.filter(t => t.id !== id);
        this.updateTransactions(filteredTransactions);
      })
    );
  }

  // Método para refrescar las transacciones desde el servidor
  refreshTransactions(): void {
    this.getAllTransactions().subscribe();
  }

  // Método para limpiar el estado
  clearTransactions(): void {
    this.updateTransactions([]);
  }

  // Método para agregar una transacción localmente (útil para optimistic updates)
  addTransactionLocally(transaction: TransactionModel): void {
    const currentTransactions = this.currentTransactions;
    this.updateTransactions([transaction, ...currentTransactions]);
  }

  // Método para filtrar transacciones por tipo
  getTransactionsByType(movementType: number): TransactionModel[] {
    return this.currentTransactions.filter(t => t.movementType === movementType);
  }

  // Método para obtener el total de ingresos
  getTotalIncome(): number {
    return this.currentTransactions
      .filter(t => t.movementType === 0)
      .reduce((total, t) => total + t.amount, 0);
  }

  // Método para obtener el total de gastos
  getTotalExpenses(): number {
    return this.currentTransactions
      .filter(t => t.movementType === 1)
      .reduce((total, t) => total + t.amount, 0);
  }

  // Método para obtener el balance
  getBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  
}
