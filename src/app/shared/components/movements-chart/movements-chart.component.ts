import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
// Importación optimizada de ECharts - solo los componentes necesarios
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Registrar los componentes necesarios
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  BarChart,
  PieChart,
  LineChart,
  CanvasRenderer
]);

@Component({
  selector: 'app-movements-chart',
  standalone: true,
  imports: [],
  templateUrl: './movements-chart.component.html',
  styleUrl: './movements-chart.component.css'
})
export class MovementsChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chart', { static: true }) chartElement!: ElementRef;
  private myChart: echarts.ECharts | null = null;
  private resizeHandler = () => {
    if (this.myChart) {
      this.myChart.resize();
    }
  };

  ngOnInit(): void {
    // Inicialización de datos si es necesario
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');
    // Delay para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      this.initChart();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.myChart) {
      this.myChart.dispose();
    }
    window.removeEventListener('resize', this.resizeHandler);
  }

  private initChart(): void {
    console.log('initChart called');
    console.log('chartElement:', this.chartElement);
    console.log('nativeElement:', this.chartElement?.nativeElement);
    
    if (this.chartElement?.nativeElement) {
      console.log('Element dimensions:', {
        width: this.chartElement.nativeElement.offsetWidth,
        height: this.chartElement.nativeElement.offsetHeight
      });
      
      this.myChart = echarts.init(this.chartElement.nativeElement);

      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
          }
        ]
      };


      this.myChart.setOption(option);
      console.log('Chart option set');

      // Hacer el gráfico responsive
      window.addEventListener('resize', this.resizeHandler);
    } else {
      console.error('Chart element not found!');
    }
  }
}
