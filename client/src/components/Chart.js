import { useParams } from 'react-router-dom'
import axios from "axios";
import { useState, useEffect } from 'react';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import ScatterChart from './ScatterChart';
import AreaChart from './AreaChart';

const Chart = () => {
    const { id } = useParams();
    const [dataObj, setDataObj] = useState({ x: [], y: [] })
    const [type, setType] = useState("")
    const [colors, setColors] = useState([])
    const [labels, setLabels] = useState([])
    const getDataObj = async () => {
        let response = await axios.get(
            `http://localhost:2000/chart/${id}`,
        )

        setDataObj(response.data.resources[0])
        setType(response.data.resources[1])
        setColors(response.data.resources[2])
        setLabels(response.data.resources[3])
    }
    useEffect(() => {
        getDataObj();
    }, [])

    const generateTypeChart = () => {
        switch (type) {
            case "bar":
                return (<div>
                    <BarChart chartId={id} dataObj={dataObj} colors={colors} labels={labels} isAuth={false}/>
                </div>)
            case "doughnut":
                return (<div>
                    <DoughnutChart dataObj={dataObj} colors={colors} labels={labels} isAuth={false}/>
                </div>)
            case "line":
                return (<div>
                    <LineChart dataObj={dataObj} colors={colors} labels={labels} isAuth={false}/>
                </div>)
            case "pie":
                return (<div>
                    <PieChart dataObj={dataObj} colors={colors} labels={labels} isAuth={false}/>
                </div>)
            case "scatter":
                return (<div>
                    <ScatterChart dataObj={dataObj} colors={colors} labels={labels} isAuth={false}/>
                </div>)
            case "area":
                return (<div>
                    <AreaChart dataObj={dataObj} colors={colors} labels={labels} isAuth={false}/>
                </div>)
            default:
                return (<></>)
        }
    }
    return (<div>
        {generateTypeChart()}
    </div>)
}

export default Chart;