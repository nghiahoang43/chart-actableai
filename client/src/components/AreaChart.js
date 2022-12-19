import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
  } from 'chart.js';
  import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
  import { Line } from 'react-chartjs-2'
  import { useState } from 'react'
  import './ModalHeaderCustomize.css'
  import axios from 'axios'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );
  
  const AreaChart = ({ chartId, dataObj, colors, labels, isAuth }) => {
    let x = dataObj.x;
    let y = dataObj.y[0];
    const [columnLabels, setColumnLabels] = useState([labels[0]])
    const [borderColors, setBorderColors] = useState([colors[0]])
    const colorSave = async () => {
        await axios.post(
            "http://localhost:2000/chart/customizeChart",
            { chartId: chartId, colors: borderColors, labels: columnLabels }
        );
    }
  
  
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const saveAndClose = () => {
        handleClose();
        colorSave();
    }
    
    let backgroundColors = [];
      for (let borderColor of borderColors) {
          backgroundColors.push(borderColor + '80');
      }
  
    return (
      <div>
        {isAuth ?
                  <div>
        <Modal size="sm" show={show} backdrop="static" onHide={handleClose}>
          <Modal.Header className='color-header' closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {borderColors.map((value, idx) => (
              <InputGroup key={idx} className="mb-3">
                <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                <Form.Control
                  type="color"
                  id="exampleColorInput"
                  defaultValue={value}
                  title="Choose your color"
                  aria-describedby="basic-addon1"
                  onChange={(e) => {
                    let newArr = [...borderColors]
                    newArr[idx] = e.target.value
                    setBorderColors(newArr)
                }}
                />
              </InputGroup>
            ))}
            {columnLabels.map((value, idx) => (
                                <InputGroup key={'d' + idx} className="mb-3">
                                    <InputGroup.Text id="basic-addon1">{'#' + (idx + 1)}</InputGroup.Text>
                                    <Form.Control
                                        id="exampleColorInput"
                                        defaultValue={value}
                                        title="Choose your label"
                                        aria-describedby="basic-addon1"
                                        onChange={(e) => {
                                            let newArr = [...columnLabels]
                                            newArr[idx] = e.target.value
                                            setColumnLabels(newArr)
                                        }}
                                    />

                                </InputGroup>
                            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button className="customize-btn1" onClick={saveAndClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Button className="customize-btn1" onClick={handleShow}>
          Customize
        </Button>
        </div> : <></>}
        <div>
          <Line
            data={{
              labels: x,
              datasets: [{
                fill: true,
                label: columnLabels[0],
                data: y,
                backgroundColor: backgroundColors[0],
                borderColor: borderColors[0],
                borderWidth: 1
              }]
            }}
            height={400}
            width={600}
            options={{
              maintainAspectRatio: false,
            }} />
        </div>
      </div>
    )
  }
  
  export default AreaChart;