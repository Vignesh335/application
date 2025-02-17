"use client"
import { Input, InputNumber, message, Upload } from 'antd';
import AppLayout from '../../Components/Layout';
import { useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';

export default function CreateAdmin() {
    const [formData, setFormData] = useState<any>({
        username: '',
        email: '',
        phone: '',
        password: '',
        location: '',
        photo: null
    });
    const [status, setStatus] = useState<any>(null);
    const router = useRouter()

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: any) => {
        const { name, files } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: files[0]
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const form = new FormData();
        form.append('username', formData.username);
        form.append('email', formData.email);
        form.append('phone', formData.phone);
        form.append('password', formData.password);
        form.append('location', formData.location);
        form.append('photo', formData.photo);

        try {
            const response = await fetch('/api/subadmin', {
                method: 'POST',
                body: form
            });

            const result = await response.json();
            if (result.id) {
                setStatus('success');
                setFormData({
                    username: '',
                    email: '',
                    phone: '',
                    password: '',
                    location: '',
                    photo: null
                })
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('error');
        }
    };

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
                <h1>Create Admin</h1>
                {status && (
                    <div className={`alert alert-${status === 'success' ? 'success' : 'danger'}`} role="alert">
                        {status === 'success' ? 'Submitted Successfully' : 'Error! Incorrect Data Found'}
                    </div>
                )}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div>
                        <label>User Name</label>
                        <Input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Phone</label>
                        <InputNumber
                            type="number"
                            name="phone"
                            value={formData.phone}
                            onChange={(value) => setFormData((prev: any) => ({
                                ...prev,
                                phone: value
                            }))
                            }
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <Input.Password
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>location</label>
                        <TextArea
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Photo</label>
                        <Upload
                            name="avatar"
                            customRequest={() => null}
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={(info) => {
                                const file = info.file.originFileObj
                                if (file) {
                                    getBase64(file).then((url) => {
                                        setFormData((prev: any) => ({
                                            ...prev,
                                            photo: url
                                        }));
                                    })
                                }
                            }}
                        >
                            {formData.photo ? <img src={formData.photo} alt="avatar" style={{ width: '100%' }} /> :
                                <button style={{ border: 0, background: 'none' }} type="button">
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </button>
                            }
                        </Upload>
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                        <button type="reset">Clear</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
