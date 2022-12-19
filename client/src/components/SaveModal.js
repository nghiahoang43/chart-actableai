import { Modal, Button, Form } from 'react-bootstrap'
import { useState } from 'react'
import './ModalHeaderCustomize.css'
const SaveModal = ({onSubmitName, isShowModal, closeModal}) => {
    const [dataSetName, setDataSetName] = useState("Untitled")

    const updateName = () =>{
        onSubmitName(dataSetName)
    }

    return (
        <>
            <Modal show={isShowModal} onHide={closeModal} animation={false}>
                <Modal.Header className="color-header" closeButton>
                    <Modal.Title>Your Dataset Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        size="lg"
                        placeholder="Enter your dataset name"
                        defaultValue={dataSetName}
                        onChange={(e) => { setDataSetName(e.target.value) }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button className="customize-btn1" onClick={updateName}>
                        Save Charts
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SaveModal;