import React, { useEffect, useState } from 'react';
import './Home.css'
import services from '../services/services';
import { Table, Select, Switch, Button, Drawer, Form, Input, DatePicker, Row, Col } from 'antd';
import { format } from 'date-fns';

const { Column } = Table;

const Home = () => {
    const [selectS, setSelect] = useState(null);
    const [data, setData] = useState([]);
    const [postTasks, setPostTasks] = useState('');
    const [postCompleted, setPostCompleted] = useState(false);
    const [postDate, setPostDate] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const getTask = async () => {
            const response = await services.getTasks();
            setData(response);
        };
        getTask();
    }, []);

    useEffect(() => {
        const getCompleted = async () => {
            if (selectS !== null) {
                const response = await services.getCompleted(selectS);
                setData(response);
            }
        };
        getCompleted();
    }, [selectS]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    };

    const onChange2 = async (checked, id) => {
        try {
            const updatedTask = { completed: checked };
            await services.upDateTask(id, updatedTask);
            setData(prevData =>
                prevData.map(task =>
                    task.id === id ? { ...task, completed: checked } : task
                )
            );
        } catch (error) {
            console.error('Ошибка при обновлении задачи:', error);
        }
    };

    const onChange = (value) => {
        setSelect(value);
    };

    const onSearch = (value) => {
        console.log('Search:', value);
    };

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const PostDataFun = () => {
        const postReqTask = async () => {
            const response = await services.postTasks(postTasks, postDate, postCompleted);
            console.log(response);
        };
        postReqTask();
    };

    return (
        <div className='container'>
            <Row gutter={16} style={{ marginBottom: 50 }}>
                <Col xs={24} sm={12} md={8}>
                    <Select
                        style={{ width: '100%' }}
                        showSearch
                        placeholder="Выберите статус"
                        optionFilterProp="label"
                        onChange={onChange}
                        onSearch={onSearch}
                        options={[
                            { value: 'true', label: 'Выполнено' },
                            { value: 'false', label: 'Не выполнено' },
                        ]}
                    />
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Button type="primary" onClick={showDrawer}>Создать Задания</Button>
                </Col>
            </Row>
            <Table dataSource={data} rowKey="id">
                <Column title="Номер" dataIndex="id" key="id" />
                <Column title="Название" dataIndex="title" key="title" />
                <Column title="До Выполнения" dataIndex="date" key="date" />
                <Column title="Статус" dataIndex="completed" key="completed" render={(text) => (
                    <span>{text ? 'Выполнено' : 'Не выполнено'}</span>
                )} />
                <Column
                    title="Статус выполненияAh"
                    dataIndex="completed"
                    key="completedSwitch"
                    render={(text, record) => (
                        <Switch
                            checked={text}
                            onChange={(checked) => onChange2(checked, record.id)}
                        />
                    )}
                />
                <Column
                    title="Число Создания"
                    dataIndex="created_at"
                    key="created_at"
                    render={(text) => formatDate(text)}
                />
            </Table>
            <Drawer title="Создание задания" onClose={onClose} open={open}>
                <Form
                    name="wrap"
                    labelCol={{
                        flex: '110px',
                    }}
                    labelAlign="left"
                    labelWrap
                    wrapperCol={{
                        flex: 1,
                    }}
                    colon={false}
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item
                        label="Названия Задача"
                        name="task"
                        rules={[{ required: true }]}
                    >
                        <Input onChange={(e) => setPostTasks(e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        label="Дата выполнения"
                        name="date"
                        rules={[{ required: true }]}
                    >
                        <DatePicker onChange={(date) => {
                            const formattedDate = date ? date.toISOString().split('T')[0] : null;
                            setPostDate(formattedDate);
                        }} />
                    </Form.Item>
                    
                    <Form.Item label="Статус выполнения">
                        <Switch checked={postCompleted} onChange={(checked) => setPostCompleted(checked)} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" onClick={PostDataFun}>
                            Создать
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Home;
