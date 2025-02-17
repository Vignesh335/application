"use client"
import AppLayout from "@/app/Components/Layout";
import { Button, Modal, Table, Input, message, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
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
        fetch("/api/medical_camp")
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if selectedSubadmin exists
        if (selectedSubadmin) {
            const formData = new FormData();

            // Assuming selectedSubadmin is an object with the required properties
            formData.append('id', selectedSubadmin.id.toString());
            formData.append('username', selectedSubadmin.username);
            formData.append('password', selectedSubadmin.password);
            formData.append('email', selectedSubadmin.email);
            formData.append('phone', selectedSubadmin.phone);
            formData.append('location', selectedSubadmin.location);

            formData.append('photo', imageUrl);

            formData.append('status', selectedSubadmin.status);

            try {
                const response = await fetch('/api/subadmin', {
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

    return (
        <AppLayout pathIndex={2} defaultpath={'/trustadmin'}>
            <div>
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
                                title: "Id	",
                                key: 'id',
                                dataIndex: 'id',
                            },
                            {
                                title: "Campaign Place	",
                                key: 'campaign_place',
                                dataIndex: 'campaign_place',
                            },
                            {
                                title: "Panchayat",
                                key: 'panchayat',
                                dataIndex: 'panchayat',
                            },
                            {
                                title: "Date",
                                key: 'date',
                                dataIndex: 'date',
                            },
                            {
                                title: "Mandal",
                                key: 'mandal',
                                dataIndex: 'mandal',
                            },
                            {
                                title: "District",
                                key: 'district',
                                dataIndex: 'district',
                            },
                            {
                                title: "State",
                                key: 'state',
                                dataIndex: 'state',
                            },
                            {
                                title: "Pin Code",
                                key: 'pin',
                                dataIndex: 'pin',
                            },
                            {
                                title: 'Actions',
                                key: 'actions',
                                render: (_, record: any) => {
                                    return <>
                                        <Button
                                            type="primary"
                                            className="btn btn-warning"
                                            onClick={() => handleEditClick(record)}
                                        >
                                            Records
                                        </Button>
                                        <Button
                                            type="primary"
                                            className="btn btn-warning"
                                            onClick={() => handleEditClick(record.id)}
                                        >
                                            Albums
                                        </Button>
                                    </>
                                }
                            },
                        ]}
                        dataSource={filteredItems}
                    />
                </div>

                <Modal
                    title="Edit Admin"
                    onOk={handleSubmit}
                    onCancel={() => {
                        setSelectedSubadmin({})
                        setImageUrl('')
                    }}
                    open={Object.keys(selectedSubadmin).length > 0 ? true : false}
                >
                    <div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                ref
                            </label>
                            {selectedSubadmin.ref}
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                campaign_place
                            </label>
                            {selectedSubadmin.campaign_place}
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                panchayat
                            </label>
                            {selectedSubadmin.panchayat}
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                date
                            </label>
                            {selectedSubadmin.date}
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                VILLAGE_NAME
                            </label>
                            {selectedSubadmin.VILLAGE_NAME}
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                mandal
                            </label>
                            {selectedSubadmin.mandal}
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                district
                            </label>
                            {selectedSubadmin.district}
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                state
                            </label>
                            {selectedSubadmin.state}
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                pin
                            </label>
                            {selectedSubadmin.pin}
                        </div>
                        <Table
                            columns={[
                                {
                                    title: 'Name',
                                    key: 'name',
                                    dataIndex: 'name'
                                },
                                {
                                    title: 'Gender',
                                    key: 'gender',
                                    dataIndex: 'gender'
                                },
                                {
                                    title: 'UID/Ration Number',
                                    key: 'uid_or_ration_no',
                                    dataIndex: 'uid_or_ration_no'
                                },
                                {
                                    title: 'Age',
                                    key: 'age',
                                    dataIndex: 'age'
                                },
                                {
                                    title: 'Relation',
                                    key: 'relation',
                                    dataIndex: 'relation'
                                },
                                {
                                    title: 'Phone Number',
                                    key: 'phone',
                                    dataIndex: 'phone'
                                },
                                {
                                    title: 'Address',
                                    key: 'address',
                                    dataIndex: 'address'
                                },
                            ]}
                            dataSource={selectedSubadmin.medicalCampRecords ?? []}
                        />
                    </div>
                </Modal>
            </div >
        </AppLayout >
    );
}
