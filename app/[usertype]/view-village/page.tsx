"use client"
import AppLayout from "@/app/Components/Layout";
import { Button, Modal, Table, Input, message, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useRef, useState } from "react";
import '@ant-design/v5-patch-for-react-19';

export default function ViewAdmins() {
    const [subadmins, setSubadmins] = useState<any>([]);
    const [selectedSubadmin, setSelectedSubadmin] = useState<any>({});
    const [loading, setLoading] = useState(true)
    const [imageUrl, setImageUrl] = useState('')
    const [searchInput, setSearchInput] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    const searchListItems = (input: string) => {
        const filtered = subadmins.filter((item: any) => {
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
        fetch("/api/village")
            .then((response) => response.json())
            .then((data) => {
                setSubadmins(data);
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
        const subadminToEdit = record;
        if (subadminToEdit) {
            setSelectedSubadmin(subadminToEdit);
            setImageUrl(subadminToEdit.photo)
        }
    };

    const handleSubmit = async (e: React.FormEvent, selectedSubadmin: any) => {
        e.preventDefault();

        // Check if selectedSubadmin exists
        if (selectedSubadmin) {
            const formData = new FormData();

            Object.entries(selectedSubadmin).map(([key, value]: any) => {
                formData.append(key, value.toString());
            })

            formData.append('photo', imageUrl);

            formData.append('status', selectedSubadmin.status);

            try {
                const response = await fetch('/api/village', {
                    method: 'PUT',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Subadmin updated successfully', result);
                    setSelectedSubadmin({})
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
        printWindow.document.write("<center><div class='row' ><div class='col-11'><h2>" + ngo + " NGO</h2></div></div></center>");
        printWindow.document.write(modalContent.innerHTML);
        printWindow.document.write("<br><br><div class='row' style='border:black solid 2px; border-radius:10px; padding:20px;'><div class='col-6'>Verified By (Name) :</div><div class='col-6'>Place :</div><br><br><div class='col-6'>Phone Number :</div><div class='col-6'>Verified By [Signature] :</div></div>");

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
                <h1>View Village</h1>

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
                                title: 'Volunteer Id',
                                key: 'refer',
                                dataIndex: 'refer'
                            },
                            {
                                title: 'Region',
                                key: 'REGION',
                                dataIndex: 'REGION'
                            },
                            {
                                title: 'Village Name',
                                key: 'VILLAGE_NAME',
                                dataIndex: 'VILLAGE_NAME'
                            },
                            {
                                title: 'Phone',
                                key: 'REQUESTED_PHONE_NUMBER',
                                dataIndex: 'REQUESTED_PHONE_NUMBER'
                            },
                            {
                                title: 'Pin code',
                                key: 'PINCODE',
                                dataIndex: 'PINCODE'
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
                    onOk={(e) => handleSubmit(e, selectedSubadmin)}
                    onCancel={() => {
                        setSelectedSubadmin({})
                        setImageUrl('')
                    }}
                    open={Object.keys(selectedSubadmin).length > 0 ? true : false}
                >
                    <div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                REGION
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="REGION"
                                value={selectedSubadmin.REGION}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        REGION: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                VILLAGE_NAME
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="VILLAGE_NAME"
                                value={selectedSubadmin.VILLAGE_NAME}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        VILLAGE_NAME: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                VILLAGE_POPULATION
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="VILLAGE_POPULATION"
                                value={selectedSubadmin.VILLAGE_POPULATION}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        VILLAGE_POPULATION: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                GRAM_PANCHAYAT_NAME
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="GRAM_PANCHAYAT_NAME"
                                value={selectedSubadmin.GRAM_PANCHAYAT_NAME}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        GRAM_PANCHAYAT_NAME: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                PANCHAYAT_POPULATION
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="PANCHAYAT_POPULATION"
                                value={selectedSubadmin.PANCHAYAT_POPULATION}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        PANCHAYAT_POPULATION: e.target.value,
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
                                value={selectedSubadmin.MANDAL_NAME}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
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
                                value={selectedSubadmin.DISTRICT_NAME}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
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
                                value={selectedSubadmin.STATE}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
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
                                value={selectedSubadmin.PINCODE}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        PINCODE: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                LATITUDE
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="LATITUDE"
                                value={selectedSubadmin.LATITUDE}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        LATITUDE: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                LONGITUDE
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="LONGITUDE"
                                value={selectedSubadmin.LONGITUDE}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        LONGITUDE: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NUMBER_OF_TEMPLE
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NUMBER_OF_TEMPLE"
                                value={selectedSubadmin.NUMBER_OF_TEMPLE}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        NUMBER_OF_TEMPLE: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NUMBER_OF_CHURCHES
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NUMBER_OF_CHURCHES"
                                value={selectedSubadmin.NUMBER_OF_CHURCHES}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        NUMBER_OF_CHURCHES: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NUMBER_OF_MOSQUES
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NUMBER_OF_MOSQUES"
                                value={selectedSubadmin.NUMBER_OF_MOSQUES}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        NUMBER_OF_MOSQUES: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                VILLAGE_LEADER_NAME
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="VILLAGE_LEADER_NAME"
                                value={selectedSubadmin.VILLAGE_LEADER_NAME}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        VILLAGE_LEADER_NAME: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                REQUESTED_FOR
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="REQUESTED_FOR"
                                value={selectedSubadmin.REQUESTED_FOR}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        REQUESTED_FOR: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                DETAILS_FOR_PROGRAMS
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="DETAILS_FOR_PROGRAMS"
                                value={selectedSubadmin.DETAILS_FOR_PROGRAMS}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        DETAILS_FOR_PROGRAMS: e.target.value,
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
                                value={selectedSubadmin.REQUESTED_THROUGH}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
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
                                value={selectedSubadmin.REQUESTED_BY_NAME}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        REQUESTED_BY_NAME: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                REQUESTED_DETAILS
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="REQUESTED_DETAILS"
                                value={selectedSubadmin.REQUESTED_DETAILS}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        REQUESTED_DETAILS: e.target.value,
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
                                value={selectedSubadmin.REQUESTED_PHONE_NUMBER}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        REQUESTED_PHONE_NUMBER: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                FINAL_DECISION
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="FINAL_DECISION"
                                value={selectedSubadmin.FINAL_DECISION}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        FINAL_DECISION: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                FINAL_DECISION_REASON
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="FINAL_DECISION_REASON"
                                value={selectedSubadmin.FINAL_DECISION_REASON}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        FINAL_DECISION_REASON: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <Button
                                type="primary"
                                onClick={(e) => {
                                    const subadminToEdit = subadmins.filter((record: any) => record.id === selectedSubadmin.id)?.[0];
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
                                    const subadminToEdit = subadmins.filter((record: any) => record.id === selectedSubadmin.id)?.[0];
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
                                onClick={() => {
                                    printModal()
                                }}
                            >
                                Print
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div >
        </AppLayout >
    );
}
