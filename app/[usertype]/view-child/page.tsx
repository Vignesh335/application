"use client"
import AppLayout from "@/app/Components/Layout";
import { Button, Modal, Table, Input, message, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useRef, useState } from "react";
import '@ant-design/v5-patch-for-react-19';

export default function ViewChild() {
    const [child, setChild] = useState<any>([]);
    const [selectedChild, setSelectedChild] = useState<any>({});
    const [loading, setLoading] = useState(true)
    const [imageUrl, setImageUrl] = useState('')
    const [searchInput, setSearchInput] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    const searchListItems = (input: string) => {
        const filtered = child.filter((item: any) => {
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
        fetch("/api/child")
            .then((response) => response.json())
            .then((data) => {
                setChild(data);
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
            setSelectedChild(subadminToEdit);
            setImageUrl(subadminToEdit.photo)
        }
    };

    const handleSubmit = async (e: React.FormEvent, selectedChild: any) => {
        e.preventDefault();

        // Check if selectedChild exists
        if (selectedChild) {
            const formData = new FormData();

            Object.entries(selectedChild).map(([key, value]: any) => {
                if (key !== 'photo') {
                    formData.append(key, value.toString());
                }
            })

            if (imageUrl !== selectedChild.photo) {
                formData.append('photo', imageUrl);
            }

            try {
                const response = await fetch('/api/child', {
                    method: 'PUT',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Subadmin updated successfully', result);
                    setSelectedChild({})
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

    const [ngoName, setNgoName] = useState("");
    const modalRef = useRef(null);

    const printModal = () => {
        const modalContent: any = modalRef.current;
        const ngo = prompt("Enter NGO Name");

        if (!ngo) return;

        const printWindow: any = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<link rel="stylesheet" type="text/css" href="style.css">');
        printWindow.document.write('<style>');
        printWindow.document.write('html, body { margin: 0; padding: 0; font-size: 12px; }'); // Adjust font size
        printWindow.document.write('@page { size: A4; margin: 0; }');
        printWindow.document.write('body { font-family: Arial, sans-serif; margin: 1cm; padding: 20px; }');
        printWindow.document.write('#not, #close { display:none; }'); // Adjust padding
        printWindow.document.write('.map { display:none; }');
        printWindow.document.write('.row { page-break-inside: avoid; }');
        printWindow.document.write('</style>');
        printWindow.document.write("<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN' crossorigin='anonymous'>");
        printWindow.document.write('</head><body>');
        printWindow.document.write("<center><div class='row'><div class='col-11'><h2>" + ngo + " NGO</h2></div></div></center>");
        printWindow.document.write(modalContent.innerHTML);
        printWindow.document.write("<br><br><div class='row'><div class='col-6'>Date :</div><div class='col-6'>Place :</div><br><br><div class='col-6'>Child Signature :</div><div class='col-6'>Parent/Guardian Signature :</div></div>");
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Wait for content to be loaded before printing
        printWindow.onload = function () {
            printWindow.print();
            printWindow.close();
        };
    };

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
                <h1>View Admin</h1>

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
                                title: 'Child name',
                                key: 'Student_Full_Name',
                                dataIndex: 'Student_Full_Name'
                            },
                            {
                                title: 'DOB',
                                key: 'Date_of_Birth',
                                dataIndex: 'Date_of_Birth'
                            },
                            {
                                title: 'Class',
                                key: 'Class',
                                dataIndex: 'Class'
                            },
                            {
                                title: 'Village',
                                key: 'Village',
                                dataIndex: 'Village'
                            },
                            {
                                title: 'Phone',
                                key: 'Parent_Contact',
                                dataIndex: 'Parent_Contact'
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
                </div >

                <Modal
                    title="Edit Admin"
                    onOk={(e) => handleSubmit(e, selectedChild)}
                    onCancel={() => {
                        setSelectedChild({})
                        setImageUrl('')
                    }}
                    open={Object.keys(selectedChild).length > 0 ? true : false}
                >
                    <div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Student_Full_Name
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Student_Full_Name"
                                value={selectedChild.Student_Full_Name}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Student_Full_Name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Date_of_Birth
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Date_of_Birth"
                                value={selectedChild.Date_of_Birth}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Date_of_Birth: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Class
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Class"
                                value={selectedChild.Class}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Class: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                School_or_College_Name
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="School_or_College_Name"
                                value={selectedChild.School_or_College_Name}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        School_or_College_Name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Gender
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Gender"
                                value={selectedChild.Gender}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Gender: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Child_Aadhar_No
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Child_Aadhar_No"
                                value={selectedChild.Child_Aadhar_No}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Child_Aadhar_No: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Father_Name
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Father_Name"
                                value={selectedChild.Father_Name}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Father_Name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Mother_Name
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Mother_Name"
                                value={selectedChild.Mother_Name}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Mother_Name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Religious
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Religious"
                                value={selectedChild.Religious}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Religious: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Caste_And_Sub_Caste
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Caste_And_Sub_Caste"
                                value={selectedChild.Caste_And_Sub_Caste}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Caste_And_Sub_Caste: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Favorite_Subject
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Favorite_Subject"
                                value={selectedChild.Favorite_Subject}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Favorite_Subject: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Favorite_Colour
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Favorite_Colour"
                                value={selectedChild.Favorite_Colour}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Favorite_Colour: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Favorite_Game
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Favorite_Game"
                                value={selectedChild.Favorite_Game}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Favorite_Game: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Best_Friend
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Best_Friend"
                                value={selectedChild.Best_Friend}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Best_Friend: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Hobbies
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Hobbies"
                                value={selectedChild.Hobbies}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Hobbies: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Goal
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Goal"
                                value={selectedChild.Goal}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Goal: e.target.value,
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
                                value={selectedChild.Door_Number}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
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
                                value={selectedChild.Street}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
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
                                value={selectedChild.Village}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Village: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Mandal
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Mandal"
                                value={selectedChild.Mandal}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Mandal: e.target.value,
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
                                value={selectedChild.City}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        City: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Pincode
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Pincode"
                                value={selectedChild.Pincode}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Pincode: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                District
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="District"
                                value={selectedChild.District}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        District: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                State
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="State"
                                value={selectedChild.State}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        State: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Country
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Country"
                                value={selectedChild.Country}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Country: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                Parent_Contact
                            </label>
                            <Input
                                type="text"
                                className="form-control"
                                name="Parent_Contact"
                                value={selectedChild.Parent_Contact}
                                onChange={(e: any) =>
                                    setSelectedChild((prev: any) => ({
                                        ...prev!,
                                        Parent_Contact: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
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
                                    const subadminToEdit = child.filter((record: any) => record.id === selectedChild.id)?.[0];
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
                                    const subadminToEdit = child.filter((record: any) => record.id === selectedChild.id)?.[0];
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
