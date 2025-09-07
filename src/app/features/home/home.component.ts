import { Component } from '@angular/core';
import { NgClass, NgFor, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NgClass, NgFor, DecimalPipe],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
  transactions = [
    { 
      icon: '�', 
      category: 'ETF', 
      subcategory: 'Investment • Cash',
      amount: 100.00, 
      type: 'income',
      color: 'purple'
    },
    { 
      icon: '⛽', 
      category: 'Gas & Fuel', 
      subcategory: 'Gas & Fuel • Cash',
      amount: -32.00, 
      type: 'expense',
      color: 'blue'
    },
    { 
      icon: '🎮', 
      category: 'Gaming', 
      subcategory: 'Gaming • Cash',
      amount: -10.00, 
      type: 'expense',
      color: 'green'
    },
    { 
      icon: '�', 
      category: 'Groceries', 
      subcategory: 'Groceries • Cash',
      amount: -92.00, 
      type: 'expense',
      color: 'orange'
    },
    { 
      icon: '💰', 
      category: 'Salary', 
      subcategory: 'Salary • Cash',
      amount: 1222.00, 
      type: 'income',
      color: 'emerald'
    },
    { 
      icon: '🏠', 
      category: 'Rent/Mortgage', 
      subcategory: 'Rent/Mortgage • Cash',
      amount: -1222.00, 
      type: 'expense',
      color: 'red'
    },
    { 
      icon: '🎯', 
      category: 'Freelance', 
      subcategory: 'Freelance • Cash',
      amount: 122.00, 
      type: 'income',
      color: 'cyan'
    }
  ];

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
