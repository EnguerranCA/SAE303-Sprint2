const templateFile = await fetch("src/ui/chart/template.html");
const template = await templateFile.text();


let ChartView = {};

  ChartView.renderChart = async function (data) {
  const categories = Object.keys(data);
  

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
    series: data
  });


  }

ChartView.render = async function (data) {
  let topChart = template;

  // let optionsFormatted = "";
  // for (let option of data) {
  //   let newOption = template_option.replace("{{id}}", option.id);
  //   newOption = newOption.replace("{{id}}", option.id);

  //   newOption = newOption.replace("{{name}}", option.name);
  //   optionsFormatted += newOption;
  // }

  // topChart = topChart.replace("{{option}}", optionsFormatted);

  // document.getElementById("data").innerHTML += topChart;

  return topChart;
};

export { ChartView };
