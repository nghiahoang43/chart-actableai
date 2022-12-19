import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Container, Form, Button, Spinner, Row, Col } from 'react-bootstrap'
import axios from "axios";
import SaveModal from './SaveModal';
import Context from '../user/Context';
import { useNavigate } from 'react-router-dom';
import ChartLink from './ChartLink';
import GlobalNavbar from './GlobalNavbar';
import './CustomizeBtn.css'
import './Main.css'

const Home = () => {
    const [dataObj, setDataObj] = useState({ x: [], y: [] })
    const [barChartId, setBarChartId] = useState("")
    const [doughnutChartId, setDoughnutChartId] = useState("")
    const [lineChartId, setLineChartId] = useState("")
    const [pieChartId, setPieChartId] = useState("")
    const [scatterChartId, setScatterChartId] = useState("")
    const [areaChartId, setAreaChartId] = useState("")
    const [chartType, setChartType] = useState("-1")
    const [curChartType, setCurChartType] = useState("")
    const [loading, setLoading] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const [colorsX, setColorsX] = useState([])
    const [colorsY, setColorsY] = useState([])
    const [labelsX, setLabelsX] = useState([])
    const [labelsY, setLabelsY] = useState([])
    const [isShowModal, setIsShowModal] = useState(false)

    const context = useContext(Context)
    const navigate = useNavigate()

    const onFormSubmit = async (e) => {
        e.preventDefault()
        if (chartType === "-1") {
            setErrMsg("Please choose chart type")
            return;
        }
        setErrMsg("")
        setBarChartId("")
        setDoughnutChartId("")
        setLineChartId("")
        setPieChartId("")
        setScatterChartId("")
        setAreaChartId("")
        setCurChartType("")
        const formData = new FormData(e.target),
            formDataObj = Object.fromEntries(formData.entries())
        if (formDataObj.data === "") {
            setErrMsg("Please enter your data")
            return;
        }
        setLoading(true)
        setDataObj({
            x: [],
            y: []
        })
        setColorsX([])
        setColorsY([])
        setLabelsX([])
        setLabelsY([])
        const response = await axios.post(
            "http://localhost:2000/plotData", 
            {
                formData: formDataObj.data
            }
        );
        const dataFetch = response.data.resources[0];
        setLoading(false)

        let dataString = dataFetch.substring(0, dataFetch.length)
        dataString = dataString.replace(/[ =;\r\n]/gm, '');
        try {
            let jsonObj = await JSON.parse(dataString)
            let obj = { x: [], y: [] }
            if (Array.isArray(jsonObj)) {
                for (let i = 0; i < jsonObj.length; i++) {
                    let idx = 0
                    for (let key in jsonObj[i]) {
                        if (idx === 0) {
                            obj.x.push(jsonObj[i][key])
                        }
                        else {
                            if ((obj.y.length < idx)) {
                                obj.y.push([])
                            }
                            let num = parseInt(jsonObj[i][key]) ? parseInt(jsonObj[i][key]) : jsonObj[i][key]
                            if (typeof (num) === 'boolean') {
                                if (num === true) {
                                    num = 1
                                }
                                else {
                                    num = 0
                                }
                            }
                            obj.y[idx - 1].push(num)
                        }
                        idx++;
                    }
                }
            }
            else {
                for (let jsonX in jsonObj) {
                    obj.x.push(parseInt(jsonX))
                    let idx = 0

                    if (typeof (jsonObj[jsonX]) === "string") {
                        if ((obj.y.length <= idx)) {
                            obj.y.push([])
                        }
                        obj.y[0].push(parseInt(jsonObj[jsonX]))
                    }
                    else {
                        for (let jsonY in jsonObj[jsonX]) {
                            if ((obj.y.length <= idx)) {
                                obj.y.push([])
                            }
                            let num = parseInt(jsonObj[jsonX][jsonY]) ? parseInt(jsonObj[jsonX][jsonY]) : jsonObj[jsonX][jsonY]
                            if (typeof (num) === 'boolean') {
                                if (num === true) {
                                    num = 1
                                }
                                else {
                                    num = 0
                                }
                            }
                            obj.y[idx].push(num)
                            idx++;
                        }
                    }
                }
            }

            // Generate color array and label array for dataObj
            for (let i = 0; i < obj.y[0].length; i++) {
                let randomColor = ""
                while (randomColor.length < 7) {
                    randomColor = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
                }
                setColorsX(colorsX => [...colorsX, randomColor])
                setLabelsX(labelsX => [...labelsX, 'Dataset ' + (i)])
            }
            for (let i = 0; i < obj.y.length; i++) {
                let randomColor = ""
                while (randomColor.length < 7) {
                    randomColor = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
                }
                setColorsY(colorsY => [...colorsY, randomColor])
                setLabelsY(labelsY => [...labelsY, 'Dataset ' + (i)])
            }
            setDataObj(obj)
            setCurChartType(chartType)
        }
        catch (e) {
            setErrMsg("Couldn't plot your data");
        }
    }
    const createChart = useCallback(async () => {
        let newChart;
        if (chartType === "bar") {
            newChart = await axios.post(
                "http://localhost:2000/chart/createChart",
                { dataObj: dataObj, type: 'bar', colors: colorsY, labels: labelsY }
            );

            setBarChartId(newChart.data.resources[0].hash_id)
        }
        else if (chartType === "doughnut") {
            newChart = await axios.post(
                "http://localhost:2000/chart/createChart",
                { dataObj: dataObj, type: 'doughnut', colors: colorsX, labels: labelsX }
            );
            setDoughnutChartId(newChart.data.resources[0].hash_id)
        }
        else if (chartType === "line") {
            newChart = await axios.post(
                "http://localhost:2000/chart/createChart",
                { dataObj: dataObj, type: 'line', colors: colorsY, labels: labelsY }
            );
            setLineChartId(newChart.data.resources[0].hash_id)
        }
        else if (chartType === "pie") {
            newChart = await axios.post(
                "http://localhost:2000/chart/createChart",
                { dataObj: dataObj, type: 'pie', colors: colorsX, labels: labelsX }
            );
            setPieChartId(newChart.data.resources[0].hash_id)
        }
        else if (chartType === "scatter") {
            newChart = await axios.post(
                "http://localhost:2000/chart/createChart",
                { dataObj: dataObj, type: 'scatter', colors: colorsY, labels: labelsY }
            );
            setScatterChartId(newChart.data.resources[0].hash_id)
        }
        else if (chartType === "area") {
            newChart = await axios.post(
                "http://localhost:2000/chart/createChart",
                { dataObj: dataObj, type: 'area', colors: colorsX, labels: labelsX }
            );
            setAreaChartId(newChart.data.resources[0].hash_id)
        }
    }, [chartType, dataObj, colorsX, colorsY, labelsX, labelsY])

    useEffect(() => {
        createChart();
    }, [createChart])

    const saveCharts = async (name) => {
        let chartId = ""
        if (curChartType === "bar") {
            chartId = barChartId;
        }
        else if (curChartType === "doughnut") {
            chartId = doughnutChartId;
        }
        else if (curChartType === "line") {
            chartId = lineChartId;
        }
        else if (curChartType === "pie") {
            chartId = pieChartId;
        }
        else if (curChartType === "scatter") {
            chartId = scatterChartId;
        }
        else if (curChartType === "area") {
            chartId = areaChartId;
        }
        await axios.post(
            "http://localhost:2000/user/save-dataset",
            {
                userId: context.user._id,
                dataSetName: name,
                data: dataObj,
                hash_id: chartId
            }
        )
    }
    const generateModal = () => {
        if (!context.user) {
            navigate('/login');
            return;
        }
        if (barChartId === "" && doughnutChartId === "" && lineChartId === "" && pieChartId === "" && scatterChartId === "" && areaChartId === "") {
            setErrMsg("No chart to save")
            return;
        }
        setIsShowModal(true)
    }
    const submitNameHandler = (name) => {
        saveCharts(name)
        closeModalHandler()
    }

    const closeModalHandler = () => {
        setIsShowModal(false)
    }

    const selectCurTypeChart = () => {
        switch (curChartType) {
            case 'bar':
                return (<ChartLink chartId={barChartId} chartType={curChartType} dataObj={dataObj} colors={colorsY} labels={labelsY}></ChartLink>);
            case 'doughnut':
                return (<ChartLink chartId={doughnutChartId} chartType={curChartType} dataObj={dataObj} colors={colorsX} labels={labelsX}></ChartLink>);
            case 'line':
                return (<ChartLink chartId={lineChartId} chartType={curChartType} dataObj={dataObj} colors={colorsY} labels={labelsY}></ChartLink>);
            case 'pie':
                return (<ChartLink chartId={pieChartId} chartType={curChartType} dataObj={dataObj} colors={colorsX} labels={labelsX}></ChartLink>);
            case 'scatter':
                return (<ChartLink chartId={scatterChartId} chartType={curChartType} dataObj={dataObj} colors={colorsY} labels={labelsY}></ChartLink>);
            case 'area':
                return (<ChartLink chartId={areaChartId} chartType={curChartType} dataObj={dataObj} colors={colorsX} labels={labelsX}></ChartLink>);
            default:
                return (<></>);
        }
    }

    const selectTypeChart = (e) => {
        setChartType(e.target.value);
    }

    return (
        <div>
            <GlobalNavbar />
            <div className="area-text-ctn">
                <SaveModal onSubmitName={submitNameHandler} isShowModal={isShowModal} closeModal={closeModalHandler}></SaveModal>
                <div>

                    <Container>
                        <Form onSubmit={onFormSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Enter your Data</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="data"
                                    placeholder="Enter Data"
                                    rows={7} />
                                <Form.Text className="text-muted">
                                    Enter as much information as possible for more accurate descriptions.
                                </Form.Text>
                            </Form.Group>
                            <Row>
                                <Col md={7}>
                                    {errMsg ? <p className='alert alert-danger' style={{ "padding": "6px 12px" }}>{errMsg}</p> : <></>}</Col>
                                <Col md={3}>
                                    <Form.Select className="mb-3 mb-sm-0" aria-label="Default select example" onChange={selectTypeChart}>
                                        <option value="-1">Select type of chart</option>
                                        <option value="bar">Bar Chart</option>
                                        <option value="doughnut">Doughnut Chart</option>
                                        <option value="line">Line Chart</option>
                                        <option value="pie">Pie Chart</option>
                                        <option value="scatter">Scatter Chart</option>
                                        <option value="area">Area Chart</option>
                                    </Form.Select>
                                </Col>
                                <Col md={1}>
                                    <div className="d-grid">
                                        <Button className="mb-3 mb-sm-0 customize-btn1" variant="primary" type="submit">
                                            {loading ? (
                                                <Spinner size="sm" />
                                            ) : (<>Generate</>)}
                                        </Button>
                                    </div>
                                </Col>
                                <Col md={1}>
                                    <div className="d-grid">
                                        {loading ? (
                                            <Button className="customize-btn3">Save</Button>
                                        ) : (<Button className="customize-btn1" onClick={generateModal}>Save</Button>)}
                                    </div>
                                </Col>

                            </Row>
                        </Form>
                        <br />

                    </Container>
                </div>
                {curChartType ?
                    <Container className='chart-ctn'>
                        {selectCurTypeChart()}
                    </Container> :
                    <></>
                }
            </div>
        </div>
    )
}

export default Home;

