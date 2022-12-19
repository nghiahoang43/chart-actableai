import SyntaxHighlighter from 'react-syntax-highlighter'
import AreaChart from './AreaChart';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import ScatterChart from './ScatterChart';
const ChartLink = ({chartId, chartType, dataObj, colors, labels}) => {
    const chartCode = `<iframe src={"http://localhost:3000/chart/${chartId}"} title='${chartType} chart'/>`

    const selectTypeChart = () => {
        switch (chartType) {
            case 'bar':
                return (<div>
                    <SyntaxHighlighter language='html'>
                        {chartCode}
                    </SyntaxHighlighter>
                    <BarChart chartId={chartId} dataObj={dataObj} colors={colors} labels={labels} isAuth={true}/>
                </div>);
            case 'doughnut':
                return (<div>
                    <SyntaxHighlighter language='html'>
                        {chartCode}
                    </SyntaxHighlighter>
                    <DoughnutChart chartId={chartId} dataObj={dataObj} colors={colors} labels={labels} isAuth={true}/>
                </div>);
            case 'line':
                return (<div>
                    <SyntaxHighlighter language='html'>
                        {chartCode}
                    </SyntaxHighlighter>
                    <LineChart chartId={chartId} dataObj={dataObj} colors={colors} labels={labels} isAuth={true}/>
                </div>);
            case 'pie':
                return (<div>
                    <SyntaxHighlighter language='html'>
                        {chartCode}
                    </SyntaxHighlighter>
                    <PieChart chartId={chartId} dataObj={dataObj} colors={colors} labels={labels} isAuth={true}/>
                </div>);
            case 'scatter':
                return (<div>
                    <SyntaxHighlighter language='html'>
                        {chartCode}
                    </SyntaxHighlighter>
                    <ScatterChart chartId={chartId} dataObj={dataObj} colors={colors} labels={labels} isAuth={true}/>
                </div>);
            case 'area':
                return (<div>
                    <SyntaxHighlighter language='html'>
                        {chartCode}
                    </SyntaxHighlighter>
                    <AreaChart chartId={chartId} dataObj={dataObj} colors={colors} labels={labels} isAuth={true}/>
                </div>);
            default:
                break;
        }
    }
    return(<>
        {selectTypeChart()}
    </>)
}

export default ChartLink