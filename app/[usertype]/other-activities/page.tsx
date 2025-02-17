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
        fetch("/api/other_activities")
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

    const handleEditClick = (id: number) => {
        const subadminToEdit = subadmins.find((subadmin: any) => subadmin.id === id);
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

            Object.entries(selectedSubadmin).map(([key, value]: any) => {
                if (key !== 'photo' && key !== 'photos') {
                    formData.append(key, value.toString());
                }
            })

            if (imageUrl !== selectedSubadmin.photo) {
                formData.append('photo', imageUrl);
            }

            formData.append('status', selectedSubadmin.status);

            try {
                const response = await fetch('/api/other_activities', {
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
                                title: 'ID',
                                key: 'id',
                                dataIndex: 'id'
                            },
                            {
                                title: 'Volunteer ID',
                                key: 'userid',
                                dataIndex: 'userid'
                            },
                            {
                                title: 'User Name',
                                key: 'Name',
                                dataIndex: 'Name'
                            },
                            {
                                title: 'Date',
                                key: 'A_date',
                                dataIndex: 'A_date'
                            },
                            {
                                title: 'Purpose',
                                key: 'purpose',
                                dataIndex: 'purpose'
                            },
                            {
                                title: 'Description',
                                key: 'description',
                                dataIndex: 'description'
                            },
                            {
                                title: 'Address',
                                key: 'address',
                                dataIndex: 'address'
                            },
                            {
                                title: 'Photo',
                                key: 'photos',
                                render: (_, record: any) => {
                                    return <Button
                                        type="primary"
                                        className="btn btn-warning"
                                    // not implemented
                                    // onClick={() => handleEditClick(record)}
                                    >
                                        View Photos
                                    </Button>
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
                                Name
                            </label>
                            <Input
                                type="number"
                                className="form-control"
                                name="Name"
                                value={selectedSubadmin.Name}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        Name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                A_date
                            </label>
                            <Input
                                type="number"
                                className="form-control"
                                name="A_date"
                                value={selectedSubadmin.A_date}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        A_date: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                purpose
                            </label>
                            <Input
                                type="number"
                                className="form-control"
                                name="purpose"
                                value={selectedSubadmin.purpose}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        purpose: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                description
                            </label>
                            <Input
                                type="number"
                                className="form-control"
                                name="description"
                                value={selectedSubadmin.description}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                address
                            </label>
                            <Input
                                type="number"
                                className="form-control"
                                name="address"
                                value={selectedSubadmin.address}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        address: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                latitude
                            </label>
                            <Input
                                type="number"
                                className="form-control"
                                name="latitude"
                                value={selectedSubadmin.latitude}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        latitude: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label style={{ color: "black", fontWeight: 600 }}>
                                longitude
                            </label>
                            <Input
                                type="number"
                                className="form-control"
                                name="longitude"
                                value={selectedSubadmin.longitude}
                                onChange={(e: any) =>
                                    setSelectedSubadmin((prev: any) => ({
                                        ...prev!,
                                        longitude: e.target.value,
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
                    </div>
                </Modal>
            </div >
        </AppLayout >
    );
}
