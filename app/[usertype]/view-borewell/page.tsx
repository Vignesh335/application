"use client"
import AppLayout from "@/app/Components/Layout";
import { Button, Modal, Table, Input, message, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useRef, useState } from "react";
import '@ant-design/v5-patch-for-react-19';

export default function ViewAdmins() {
    const [subadmins, setSubadmins] = useState<any>([]);
    const [selectedBorewell, setSelectedBorewell] = useState<any>({});
    const [loading, setLoading] = useState(true)
    const [showPhotosModal, setShowPhotosModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
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
        fetch("/api/borewell")
            .then((response) => response.json())
            .then((data) => {
                setSubadmins(data);
                setFilteredItems(data);
                setShowEditModal(false)
            })
            .catch((error) => {
                console.error("There was an error fetching the subadmin data!", error);
            }).finally(() => {
                setLoading(false)
            })
    }

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
        printWindow.document.write('#not,#close { display:none; }');
        printWindow.document.write('.map{ display:none; }'); // Adjust padding
        printWindow.document.write('.row { page-break-inside: avoid; }');
        printWindow.document.write('</style>');
        printWindow.document.write("<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN' crossorigin='anonymous'>");  // Include your styles
        printWindow.document.write('</head><body>');
        printWindow.document.write("<center><div class='row'><div class='col-11'><h2>" + ngo + " NGO</h2></div></div></center>");
        printWindow.document.write(modalContent.innerHTML);
        printWindow.document.write("<br><br><div class='row'><div class='col-6'>Date </div><div class='col-6'>Place :</div><br><br><div class='col-6'> Applicant Signature :</div><div class='col-6'></div></div>");
        printWindow.document.write('<br><br>Note</b> : Applicant  Aadhar Card Xerox Copy Should Be attached to this Application');
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Wait for content to be loaded before printing
        printWindow.onload = function () {
            printWindow.print();
            printWindow.close();
        };
    }

    useEffect(() => {
        getAdmins()
    }, []);

    const handleEditClick = (record: any) => {
        const subadminToEdit = record;
        if (subadminToEdit) {
            setSelectedBorewell(subadminToEdit);
            setImageUrl(subadminToEdit.photo)
        }
    };

    const handleSubmit = async (e: React.FormEvent, selectedBorewell: any) => {
        e.preventDefault();

        if (selectedBorewell) {
            const formData = new FormData();

            Object.entries(selectedBorewell).map(([key, value]: any) => {
                if (key !== 'photo' && key !== 'photos') {
                    formData.append(key, value.toString());
                }
            })

            try {
                const response = await fetch('/api/borewell', {
                    method: 'PUT',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Subadmin updated successfully', result);
                    setSelectedBorewell({})
                    setImageUrl('')
                    getAdmins()
                    setShowEditModal(false)
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

    return (
        <AppLayout pathIndex={2} defaultpath={'/trustadmin'}>
            <div>
                <div ref={modalRef} id="modalContent">
                </div>
                <h1>View Borewell</h1>

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
                                key: 'ref',
                                dataIndex: 'ref'
                            },
                            {
                                title: 'Vilage Name',
                                key: 'Village_Name',
                                dataIndex: 'Village_Name'
                            },
                            {
                                title: 'Phone',
                                key: 'Phone_Number',
                                dataIndex: 'Phone_Number'
                            },
                            {
                                title: 'Mandal',
                                key: 'Mandal_Name',
                                dataIndex: 'Mandal_Name'
                            },
                            {
                                title: 'Actions',
                                key: 'actions',
                                render: (_, record: any) => {
                                    return <Button
                                        type="primary"
                                        className="btn btn-warning"
                                        onClick={() => {
                                            handleEditClick(record)
                                            setShowEditModal(true)
                                        }}
                                    >
                                        Edit
                                    </Button>
                                }
                            },
                            {
                                title: 'Photos',
                                key: 'photos',
                                dataIndex: 'photos',
                                render: (_, record) => {
                                    return <Button
                                        onClick={() => {
                                            handleEditClick(record)
                                            setShowPhotosModal(true)
                                        }}
                                    >
                                        Photos
                                    </Button>
                                }
                            },
                        ]}
                        dataSource={filteredItems}
                    />
                </div>

                <Modal
                    title="View Photos"
                    footer={null}
                    onCancel={() => {
                        setSelectedBorewell({})
                        setImageUrl('')
                        setShowPhotosModal(false)
                    }}
                    open={showPhotosModal}
                >
                    <>
                        {
                            (selectedBorewell.photos ?? []).map((photo: any) => {
                                return <>
                                    <img src={photo}></img>
                                </>
                            })
                        }
                    </>
                </Modal>
                <Modal
                    title="Edit Admin"
                    onOk={(e) => handleSubmit(e, selectedBorewell)}
                    onCancel={() => {
                        setSelectedBorewell({})
                        setImageUrl('')
                        setShowEditModal(false)
                    }}
                    open={showEditModal}
                >
                    <div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Village_Name
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Village_Name"
                                value={selectedBorewell.Village_Name}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Village_Name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Mandal_Name
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Mandal_Name"
                                value={selectedBorewell.Mandal_Name}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Mandal_Name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                District_Name
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="District_Name"
                                value={selectedBorewell.District_Name}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        District_Name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                State_Name
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="State_Name"
                                value={selectedBorewell.State_Name}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        State_Name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Type_of_drilling
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Type_of_drilling"
                                value={selectedBorewell.Type_of_drilling}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Type_of_drilling: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                If_drilling_with_rig_type_of_rig
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="If_drilling_with_rig_type_of_rig"
                                value={selectedBorewell.If_drilling_with_rig_type_of_rig}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        If_drilling_with_rig_type_of_rig: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Drilling_depth_in_feet
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Drilling_depth_in_feet"
                                value={selectedBorewell.Drilling_depth_in_feet}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Drilling_depth_in_feet: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Dimensions_of_casing
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Dimensions_of_casing"
                                value={selectedBorewell.Dimensions_of_casing}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Dimensions_of_casing: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Casing_thickness_in_MM
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Casing_thickness_in_MM"
                                value={selectedBorewell.Casing_thickness_in_MM}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Casing_thickness_in_MM: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Casing_diameter_in_Inches
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Casing_diameter_in_Inches"
                                value={selectedBorewell.Casing_diameter_in_Inches}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Casing_diameter_in_Inches: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Depth_of_casing_in_feet
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Depth_of_casing_in_feet"
                                value={selectedBorewell.Depth_of_casing_in_feet}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Depth_of_casing_in_feet: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Ground_water_level_in_feet
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Ground_water_level_in_feet"
                                value={selectedBorewell.Ground_water_level_in_feet}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Ground_water_level_in_feet: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Type_of_hand_pump
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Type_of_hand_pump"
                                value={selectedBorewell.Type_of_hand_pump}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Type_of_hand_pump: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Water_pipe_length
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Water_pipe_length"
                                value={selectedBorewell.Water_pipe_length}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Water_pipe_length: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Number_of_Pipes_used
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Number_of_Pipes_used"
                                value={selectedBorewell.Number_of_Pipes_used}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Number_of_Pipes_used: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Number_of_Rods_used
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Number_of_Rods_used"
                                value={selectedBorewell.Number_of_Rods_used}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Number_of_Rods_used: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Number_of_Couplings_fitted
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Number_of_Couplings_fitted"
                                value={selectedBorewell.Number_of_Couplings_fitted}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Number_of_Couplings_fitted: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Depth_of_Cylinder
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Depth_of_Cylinder"
                                value={selectedBorewell.Depth_of_Cylinder}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Depth_of_Cylinder: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Hand_set_paint
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Hand_set_paint"
                                value={selectedBorewell.Hand_set_paint}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Hand_set_paint: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Type_of_Platfor
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Type_of_Platfor"
                                value={selectedBorewell.Type_of_Platfor}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Type_of_Platfor: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Plaque_type
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Plaque_type"
                                value={selectedBorewell.Plaque_type}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Plaque_type: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                If_special_mention_the_name
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="If_special_mention_the_name"
                                value={selectedBorewell.If_special_mention_the_name}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        If_special_mention_the_name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Latitude
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Latitude"
                                value={selectedBorewell.Latitude}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Latitude: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Longitude
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Longitude"
                                value={selectedBorewell.Longitude}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Longitude: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Type_of_Soil
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Type_of_Soil"
                                value={selectedBorewell.Type_of_Soil}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Type_of_Soil: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Static_water_level
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Static_water_level"
                                value={selectedBorewell.Static_water_level}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Static_water_level: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Total_depth_of_drilling
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Total_depth_of_drilling"
                                value={selectedBorewell.Total_depth_of_drilling}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Total_depth_of_drilling: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Operator_Name_And_Contact_No
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Operator_Name_And_Contact_No"
                                value={selectedBorewell.Operator_Name_And_Contact_No}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Operator_Name_And_Contact_No: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Owner_Name_And_Contact_No
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Owner_Name_And_Contact_No"
                                value={selectedBorewell.Owner_Name_And_Contact_No}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Owner_Name_And_Contact_No: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Vehicle_RC_No
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Vehicle_RC_No"
                                value={selectedBorewell.Vehicle_RC_No}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Vehicle_RC_No: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                House_owner_Full_Name_1
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="House_owner_Full_Name_1"
                                value={selectedBorewell.House_owner_Full_Name_1}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        House_owner_Full_Name_1: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Contact_no_1
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Contact_no_1"
                                value={selectedBorewell.Contact_no_1}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Contact_no_1: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Signature_1
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Signature_1"
                                value={selectedBorewell.Signature_1}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Signature_1: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                House_owner_Full_Name_2
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="House_owner_Full_Name_2"
                                value={selectedBorewell.House_owner_Full_Name_2}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        House_owner_Full_Name_2: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Contact_no_2
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Contact_no_2"
                                value={selectedBorewell.Contact_no_2}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Contact_no_2: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Signature_2
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Signature_2"
                                value={selectedBorewell.Signature_2}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Signature_2: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Final_Status
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Final_Status"
                                value={selectedBorewell.Final_Status}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Final_Status: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NUMBER_Of_PANCHAYAT_TANKS_AVAILABLE
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NUMBER_Of_PANCHAYAT_TANKS_AVAILABLE"
                                value={selectedBorewell.NUMBER_Of_PANCHAYAT_TANKS_AVAILABLE}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        NUMBER_Of_PANCHAYAT_TANKS_AVAILABLE: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NUMBER_OF_PANCHAYAT_TAPS
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NUMBER_OF_PANCHAYAT_TAPS"
                                value={selectedBorewell.NUMBER_OF_PANCHAYAT_TAPS}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        NUMBER_OF_PANCHAYAT_TAPS: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NUMBER_OF_OPEN_GROUND_WELLS
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NUMBER_OF_OPEN_GROUND_WELLS"
                                value={selectedBorewell.NUMBER_OF_OPEN_GROUND_WELLS}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        NUMBER_OF_OPEN_GROUND_WELLS: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NUMBER_OF_PANCHAYAT_BORE_WELLS
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NUMBER_OF_PANCHAYAT_BORE_WELLS"
                                value={selectedBorewell.NUMBER_OF_PANCHAYAT_BORE_WELLS}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        NUMBER_OF_PANCHAYAT_BORE_WELLS: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NUMBER_OF_NGO_WELLS
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NUMBER_OF_NGO_WELLS"
                                value={selectedBorewell.NUMBER_OF_NGO_WELLS}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        NUMBER_OF_NGO_WELLS: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                MENTION_DETAILS
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="MENTION_DETAILS"
                                value={selectedBorewell.MENTION_DETAILS}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        MENTION_DETAILS: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                DATE_OF_DRILLING
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="DATE_OF_DRILLING"
                                value={selectedBorewell.DATE_OF_DRILLING}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        DATE_OF_DRILLING: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                PRESENT_WELL_CONDITION
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="PRESENT_WELL_CONDITION"
                                value={selectedBorewell.PRESENT_WELL_CONDITION}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        PRESENT_WELL_CONDITION: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NAME_OF_NGO
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NAME_OF_NGO"
                                value={selectedBorewell.NAME_OF_NGO}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        NAME_OF_NGO: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                NUMBER_OF_HOUSE_HOLDS_INTENDED_TO_BE_SERVED
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="NUMBER_OF_HOUSE_HOLDS_INTENDED_TO_BE_SERVED"
                                value={selectedBorewell.NUMBER_OF_HOUSE_HOLDS_INTENDED_TO_BE_SERVED}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        NUMBER_OF_HOUSE_HOLDS_INTENDED_TO_BE_SERVED: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                SELF_MADE_BORE_WELLS_DETAILS
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="SELF_MADE_BORE_WELLS_DETAILS"
                                value={selectedBorewell.SELF_MADE_BORE_WELLS_DETAILS}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        SELF_MADE_BORE_WELLS_DETAILS: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Verified_By
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Verified_By"
                                value={selectedBorewell.Verified_By}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Verified_By: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Place
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Place"
                                value={selectedBorewell.Place}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Place: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Phone_Number
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Phone_Number"
                                value={selectedBorewell.Phone_Number}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Phone_Number: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Signature
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Signature"
                                value={selectedBorewell.Signature}
                                onChange={(e: any) =>
                                    setSelectedBorewell((prev: any) => ({
                                        ...prev!,
                                        Signature: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div>
                            <Button
                                type="primary"
                                onClick={(e) => {
                                    const subadminToEdit = subadmins.filter((record: any) => record.id === selectedBorewell.id)?.[0];
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
                                    const subadminToEdit = subadmins.filter((record: any) => record.id === selectedBorewell.id)?.[0];
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
            </div >
        </AppLayout >
    );
}
