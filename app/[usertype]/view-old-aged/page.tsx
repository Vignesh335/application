"use client"
import AppLayout from "@/app/Components/Layout";
import { Button, Modal, Table, Input, message, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useRef, useState } from "react";
import '@ant-design/v5-patch-for-react-19';

export default function ViewOldAged() {
    const [oldAgedPeople, setOldAged] = useState<any>([]);
    const [selectedOldAged, setSelectedOldAged] = useState<any>({});
    const [loading, setLoading] = useState(true)
    const [imageUrl, setImageUrl] = useState('')
    const [searchInput, setSearchInput] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    const searchListItems = (input: string) => {
        const filtered = oldAgedPeople.filter((item: any) => {
            const searchQuery = input.toUpperCase();

            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const value = String(item[key]).toUpperCase();
                    if (value.indexOf(searchQuery) > -1) {
                        return true;
                    }
                }
            }

            return false;
        });

        setFilteredItems(filtered);
    };

    const handleSearchInputChange = (e: any) => {
        const value = e.target.value;
        setSearchInput(value);
        searchListItems(value);
    };

    function getAdmins() {
        setLoading(true)
        fetch("/api/widow_aged?type=1")
            .then((response) => response.json())
            .then((data) => {
                setOldAged(data);
                setFilteredItems(data);
            })
            .catch((error) => {
                console.error("There was an error fetching the subadmin data!", error);
            }).finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getAdmins()
    }, []);

    const handleEditClick = (record: any) => {
        const selectedWidowData = record
        if (selectedWidowData) {
            setSelectedOldAged(selectedWidowData);
            setImageUrl(selectedWidowData.photo)
        }
    };

    const handleSubmit = async (e: React.FormEvent, selectedOldAged: any) => {
        e.preventDefault();

        // Check if selectedOldAged exists
        if (selectedOldAged) {
            const formData = new FormData();

            Object.entries(selectedOldAged).map(([key, value]: any) => {
                if (key !== 'photo') {
                    formData.append(key, value.toString());
                }
            })

            if (imageUrl !== selectedOldAged.photo) {
                formData.append('photo', imageUrl);
            }

            try {
                const response = await fetch('/api/widow_aged', {
                    method: 'PUT',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Subadmin updated successfully', result);
                    setSelectedOldAged({})
                    setImageUrl('')
                    getAdmins()
                } else {
                    console.error('Error updating subadmin', result.error);
                }
            } catch (error) {
                console.error('Failed to make the PUT request', error);
            }
        }
    };

    const handleChange = (info: any) => {
        console.log(info)
        const file = info.file.originFileObj
        if (file) {
            getBase64(file).then((url) => {
                setImageUrl(url);
            })
        }
    }

    function getBase64(file: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(typeof (reader.result) === "string" ? reader.result : "");
            reader.onerror = error => reject(error);
        });
    }

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        console.log(isJpgOrPng && isLt2M)
        return isJpgOrPng && isLt2M;
    };

    const modalRef = useRef(null)

    function printModal() {
        var modalContent: any = modalRef.current;
        var ngo = prompt("Enter NGO Name");
  
        // Open a new window with the modal content
        var printWindow: any = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<link rel="stylesheet" type="text/css" href="style.css">');
        printWindow.document.write('<style>');
        printWindow.document.write('html, body { margin: 0; padding: 0; font-size: 12px; }'); // Adjust font size
        printWindow.document.write('@page { size: A4; margin: 0; }');
        printWindow.document.write('body { font-family: Arial, sans-serif; margin: 1cm; padding: 20px; }');
        printWindow.document.write('#not,#close { display:none; }'); // Adjust padding
        printWindow.document.write('.map{ display:none; }');
        printWindow.document.write('.row { page-break-inside: avoid; }');
        printWindow.document.write('</style>');
        printWindow.document.write("<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN' crossorigin='anonymous'>");  // Include your styles
        printWindow.document.write('</head><body>');
        printWindow.document.write("<center><div class='row'><div class='col-11'><h2>" + ngo + " NGO</h2></div></div></center>");
        printWindow.document.write(modalContent.innerHTML);
        printWindow.document.write("<div class='row'><div class='col-6'>Date </div><div class='col-6'>Place :</div><div class='col-6'> Applicant Signature :</div><div class='col-6'></div></div>");
        printWindow.document.write('<span>Note</b> : Applicant  Aadhar Card Xerox Copy Should Be attached to this Application</span>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
  
        // Wait for content to be loaded before printing
        printWindow.onload = function () {
          printWindow.print();
          printWindow.close();
        };
      }

    return (
        <AppLayout pathIndex={2} defaultpath={'/trustadmin'}>
            <div>
                <div ref={modalRef} id="modalContent">
                </div>
                <h1>View Old Aged</h1>

                <div className="order">
                    <div className="head">
                        <h3>List</h3>
                        <input
                            id="searchInput"
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                    </div>

                    <Table
                        rowKey={'id'}
                        loading={loading}
                        columns={[
                            {
                                title: 'ID',
                                key: 'id',
                                dataIndex: 'id'
                            },
                            {
                                title: 'Volunteer ID',
                                key: 'refer',
                                dataIndex: 'refer'
                            },
                            {
                                title: 'Widow Name',
                                key: 'NAME_OF_THE_APPLICANTE',
                                dataIndex: 'NAME_OF_THE_APPLICANTE'
                            },
                            {
                                title: 'Village',
                                key: 'Village',
                                dataIndex: 'Village'
                            },
                            {
                                title: 'Mandal',
                                key: 'PINCODE',
                                dataIndex: 'PINCODE'
                            },
                            {
                                title: 'Phone number',
                                key: 'PHONE_NUMBER',
                                dataIndex: 'PHONE_NUMBER'
                            },
                            {
                                title: 'Actions',
                                key: 'actions',
                                render: (_, record: any) => {
                                    if (record['status'] == 0) {
                                        return <Button
                                            type='primary'
                                            onClick={() => { handleEditClick(record) }}
                                        >
                                            Verify
                                        </Button>
                                    } else if (record['status'] == 1) {
                                        return <Button
                                            onClick={() => { handleEditClick(record) }}
                                        >
                                            Aproval
                                        </Button>
                                    } else if (record['status'] == 2) {
                                        return <Button
                                            onClick={() => { handleEditClick(record) }}
                                        >
                                            Approved
                                        </Button>
                                    } else if (record['status'] == 3) {
                                        return <Button
                                            onClick={() => { handleEditClick(record) }}
                                        >
                                            Rejected
                                        </Button>
                                    }
                                }
                            },
                        ]}
                        dataSource={filteredItems}
                    />
                </div>

                <Modal
                    title="Edit Admin"
                    onOk={(e) => handleSubmit(e, selectedOldAged)}
                    onCancel={() => {
                        setSelectedOldAged({})
                        setImageUrl('')
                    }}
                    open={Object.keys(selectedOldAged).length > 0 ? true : false}
                >
                    <div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NAME_OF_THE_APPLICANTE
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NAME_OF_THE_APPLICANTE"
                                value={selectedOldAged.NAME_OF_THE_APPLICANTE}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        NAME_OF_THE_APPLICANTE: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                DATE_OF_BIRTH
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="DATE_OF_BIRTH"
                                value={selectedOldAged.DATE_OF_BIRTH}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        DATE_OF_BIRTH: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                AADHAR_CARD_NUMBER
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="AADHAR_CARD_NUMBER"
                                value={selectedOldAged.AADHAR_CARD_NUMBER}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        AADHAR_CARD_NUMBER: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                HUSBAND_NAME
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="HUSBAND_NAME"
                                value={selectedOldAged.HUSBAND_NAME}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        HUSBAND_NAME: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                MARRIAGE_DATE
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="MARRIAGE_DATE"
                                value={selectedOldAged.MARRIAGE_DATE}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        MARRIAGE_DATE: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NUMBER_OF_CHILDREN
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NUMBER_OF_CHILDREN"
                                value={selectedOldAged.NUMBER_OF_CHILDREN}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        NUMBER_OF_CHILDREN: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                HUSBAND_PASSED_YEAR
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="HUSBAND_PASSED_YEAR"
                                value={selectedOldAged.HUSBAND_PASSED_YEAR}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        HUSBAND_PASSED_YEAR: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                CAUSE_OF_DEATH
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="CAUSE_OF_DEATH"
                                value={selectedOldAged.CAUSE_OF_DEATH}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        CAUSE_OF_DEATH: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                RECEVING_PENSION
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="RECEVING_PENSION"
                                value={selectedOldAged.RECEVING_PENSION}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        RECEVING_PENSION: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                HEALTH_PROBLEMS
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="HEALTH_PROBLEMS"
                                value={selectedOldAged.HEALTH_PROBLEMS}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        HEALTH_PROBLEMS: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                PRESENT_LIVING_STATUS
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="PRESENT_LIVING_STATUS"
                                value={selectedOldAged.PRESENT_LIVING_STATUS}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        PRESENT_LIVING_STATUS: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Door_Number
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Door_Number"
                                value={selectedOldAged.Door_Number}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        Door_Number: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Street
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Street"
                                value={selectedOldAged.Street}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        Street: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Village
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Village"
                                value={selectedOldAged.Village}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        Village: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                City
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="City"
                                value={selectedOldAged.City}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        City: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                MANDAL_NAME
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="MANDAL_NAME"
                                value={selectedOldAged.MANDAL_NAME}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        MANDAL_NAME: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                DISTRICT_NAME
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="DISTRICT_NAME"
                                value={selectedOldAged.DISTRICT_NAME}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        DISTRICT_NAME: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                STATE
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="STATE"
                                value={selectedOldAged.STATE}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        STATE: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                PINCODE
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="PINCODE"
                                value={selectedOldAged.PINCODE}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        PINCODE: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                PHONE_NUMBER
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="PHONE_NUMBER"
                                value={selectedOldAged.PHONE_NUMBER}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        PHONE_NUMBER: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                REQUESTED_THROUGH
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="REQUESTED_THROUGH"
                                value={selectedOldAged.REQUESTED_THROUGH}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        REQUESTED_THROUGH: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                REQUESTED_BY_NAME
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="REQUESTED_BY_NAME"
                                value={selectedOldAged.REQUESTED_BY_NAME}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        REQUESTED_BY_NAME: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                REQUESTED_PLACE
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="REQUESTED_PLACE"
                                value={selectedOldAged.REQUESTED_PLACE}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        REQUESTED_PLACE: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                REQUESTED_PHONE_NUMBER
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="REQUESTED_PHONE_NUMBER"
                                value={selectedOldAged.REQUESTED_PHONE_NUMBER}
                                onChange={(e: any) =>
                                    setSelectedOldAged((prev: any) => ({
                                        ...prev!,
                                        REQUESTED_PHONE_NUMBER: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-9">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Photo
                            </label>
                            <Upload
                                name="avatar"
                                customRequest={() => null}
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> :
                                    <button style={{ border: 0, background: 'none' }} type="button">
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </button>
                                }
                            </Upload>
                        </div>

                        <div>
                            <Button
                                type="primary"
                                onClick={(e) => {
                                    const subadminToEdit = oldAgedPeople.filter((record: any) => record.id === selectedOldAged.id)?.[0];
                                    handleSubmit(e, {
                                        ...subadminToEdit,
                                        status: '2'
                                    })
                                }}
                            >
                                Approve
                            </Button>
                            <Button
                                danger
                                onClick={(e) => {
                                    const subadminToEdit = oldAgedPeople.filter((record: any) => record.id === selectedOldAged.id)?.[0];
                                    handleSubmit(e, {
                                        ...subadminToEdit,
                                        status: '3'
                                    })
                                }}
                            >
                                Reject
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => printModal()}
                            >
                                Print
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </AppLayout>
    );
}
