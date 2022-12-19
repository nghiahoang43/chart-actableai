import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { Doughnut } from 'react-chartjs-2'
import { useState } from 'react'
import './ModalHeaderCustomize.css'
import axios from 'axios'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const DoughnutChart = ({ chartId, dataObj, colors, labels, isAuth }) => {
  let x = dataObj.x;
  let y = dataObj.y[0];
  const [borderColors, setBorderColors] = useState(colors)
  const colorSave = async () => {
      await axios.post(
          "http://localhost:2000/chart/customizeChart",
          { chartId: chartId, colors: borderColors, labels: labels }
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

    let datasets = []
    for (let i = 0; i < y.length; i++) {
        datasets.push(
            {
                label: 'Dataset ' + (i + 1),
                data: y[i],
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }
        )
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
        <Doughnut
          data={{
            labels: x,
            datasets: [{
              label: 'Plot',
              data: y,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
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

export default DoughnutChart;