const templateFile = await fetch("src/ui/chart/template.html");
const template = await templateFile.text();

import Highcharts from "highcharts";


let ChartView = {};

  ChartView.renderChart = function (returnedData) {
  let data = returnedData.seriesData;
  let categories = returnedData.categories;

  Highcharts.chart('chart', {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Department Data'
    },
    xAxis: {
      categories: categories,
      title: {
        text: 'Departments'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Count',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    plotOptions: {
      bar: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: data,
  });


  }

ChartView.render = async function (data) {
  let topChart = template;

  return topChart;
};

export { ChartView };
