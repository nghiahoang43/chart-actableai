import { Button, Modal } from "react-bootstrap"
import axios from "axios"
import { useEffect, useContext, useState, useCallback } from "react"
import Context from '../user/Context';
import moment from 'moment'
import ChartLink from "./ChartLink";
import GlobalNavbar from './GlobalNavbar';
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './ModalHeaderCustomize.css'
import './Main.css'

const DataPage = () => {
  const columns = [
    { field: 'name', headerName: 'Name', minWidth: 200, flex: 1.5},
    { field: 'curDate', headerName: 'Created Date', minWidth: 200, flex: 2, valueGetter: (params) => {return moment(params.row.curDate).format("DD-MM-YYYY HH:mm")} },
    { field: 'chart', headerName: 'Chart Type', minWidth: 100, flex: 1, valueGetter: (params) => {return params.row.chart.type } },
    {
      field: '_id', headerName: 'Edit', minWidth: 200, flex: 2, renderCell: (params) => (
        <div>
          <Button className="customize-btn5" onClick={() => { deleteDataSet(params.row._id) }}>Delete</Button>{' '}
          <Button className="customize-btn4" id={params.row.chart.hash_id} onClick={showChartModal}>Show</Button>
        </div>
      )
    },
  ]
  const context = useContext(Context)
  const navigate = useNavigate()
  useEffect(() => {
    if (!context.user) {
      navigate('/')
    }
  }, [context, navigate])
  const [dataSets, setDataSets] = useState([])
  const [show, setShow] = useState(false);
  const [dataObj, setDataObj] = useState({ x: [], y: [] })
  const [chartId, setChartId] = useState("")
  const [type, setType] = useState("")
  const [colors, setColors] = useState([])
  const [labels, setLabels] = useState([])

  const getData = useCallback(async () => {
    if (context.user) {
      let response = await axios.post(
        "http://localhost:2000/user/get-datasets",
        {
          userId: context.user._id,
        }
      )
      setDataSets(response.data.resources[0])
    }
  }, [context.user])

  const deleteDataSet = async (dataSetId) => {
    await axios.post(
      "http://localhost:2000/user/delete-dataset",
      {
        userId: context.user._id,
        dataSetId: dataSetId
      }
    )
    getData();
  }
  
  useEffect(() => {
    getData();
  }, [getData])

  const showChartModal = async (e) => {
    setChartId(e.currentTarget.id)
    let response = await axios.get(
      `http://localhost:2000/chart/${e.currentTarget.id}`,
    )
    setDataObj(response.data.resources[0])
    setType(response.data.resources[1])
    setColors(response.data.resources[2])
    setLabels(response.data.resources[3])
    setShow(true)
  }
  

  return (<div>
    <GlobalNavbar/>
    <Modal fullscreen={true} show={show} onHide={() => setShow(false)}>
      <Modal.Header className="color-header" closeButton>
        <Modal.Title>Chart</Modal.Title>
      </Modal.Header>
      <Modal.Body><ChartLink chartId={chartId} chartType={type} dataObj={dataObj} colors={colors} labels={labels} /></Modal.Body>
    </Modal>
    <div className="area-text-ctn">    
      <div className="data-grid-ctn" style={{ height: '80vh', width: '80%', maxHeight: '660px' }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={dataSets}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          components={{ Toolbar: GridToolbar }}
        />
      </div>
    </div>
  </div>)
}

export default DataPage