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
        fetch("/api/subadmin")
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

            // Assuming selectedSubadmin is an object with the required properties
            formData.append('id', selectedSubadmin.id.toString());
            formData.append('username', selectedSubadmin.username);
            formData.append('password', selectedSubadmin.password);
            formData.append('email', selectedSubadmin.email);
            formData.append('phone', selectedSubadmin.phone);
            formData.append('location', selectedSubadmin.location);

            if (imageUrl !== selectedSubadmin.photo) {
                formData.append('photo', imageUrl);
            }

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
                                title: 'ID',
                                key: 'id',
                                dataIndex: 'id'
                            },
                            {
                                title: 'User Name',
                                key: 'username',
                                dataIndex: 'username'
                            },
                            {
                                title: 'Email',
                                key: 'email',
                                dataIndex: 'email'
                            },
                            {
                                title: 'Phone',
                                key: 'phone',
                                dataIndex: 'phone'
                            },
                            {
                                title: 'Address',
                                key: 'location',
                                dataIndex: 'location'
                            },
                            {
                                title: 'Actions',
                                key: 'actions',
                                render: (_, record: any) => {
                                    return <Button
                                        type="primary"
                                        className="btn btn-warning"
                                        onClick={() => handleEditClick(record.id)}
                                    >
                                        Edit
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
                        <div className="row g-3">
                            <div className="col-6">
                                <label style={{ color: "black", fontWeight: 600 }}>
                                    User Name
                                </label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={selectedSubadmin.username}
                                    onChange={(e: any) =>
                                        setSelectedSubadmin((prev: any) => ({
                                            ...prev!,
                                            username: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <label style={{ color: "black", fontWeight: 600 }}>
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={selectedSubadmin.email}
                                    onChange={(e) =>
                                        setSelectedSubadmin((prev: any) => ({
                                            ...prev!,
                                            email: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <label style={{ color: "black", fontWeight: 600 }}>
                                    Phone
                                </label>
                                <Input
                                    type="number"
                                    className="form-control"
                                    name="phone"
                                    value={selectedSubadmin.phone}
                                    onChange={(e: any) =>
                                        setSelectedSubadmin((prev: any) => ({
                                            ...prev!,
                                            phone: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <label style={{ color: "black", fontWeight: 600 }}>
                                    Password
                                </label>
                                <div>
                                    <Input.Password
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={selectedSubadmin.password}
                                        onChange={(e) =>
                                            setSelectedSubadmin((prev: any) => ({
                                                ...prev!,
                                                password: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <label style={{ color: "black", fontWeight: 600 }}>
                                    Address
                                </label>
                                <TextArea
                                    className="form-control"
                                    name="address"
                                    value={selectedSubadmin.location}
                                    onChange={(e) =>
                                        setSelectedSubadmin((prev: any) => ({
                                            ...prev!,
                                            location: e.target.value,
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
                            {/* <div className="col-3">
                                <label style={{ color: "black", fontWeight: 600 }}>
                                    Photo
                                </label>
                                <br />
                                <img
                                    src={`subphotos/${selectedSubadmin.photo}`}
                                    alt="Photo"
                                    style={{ height: "80px", width: "80px", border: "1px solid black" }}
                                />
                            </div> */}
                        </div>
                    </div>
                </Modal>
            </div >
        </AppLayout >
    );
}
