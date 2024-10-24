import React, { useEffect, useState } from 'react';
import services from '../services/services';
import { Table, Select, Switch, Button, Drawer, Form, Input, DatePicker } from 'antd';
import { format } from 'date-fns';


const { Column } = Table;

const Home = () => {
    const [selectS, setSelect] = useState(null);
    const [data, setData] = useState([]);
    const [postTasks, setPostTasks] = useState('')
    const [postCompleted, setPostCompleted] = useState(false)
    const [postDate, setPostDate] = useState('')


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

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    };

    // Обработчик изменения переключателя для обновления статуса
    const onChange2 = async (checked, id) => {
        try {
            // Отправляем PUT запрос с обновлением только поля completed
            const updatedTask = {
                completed: checked
            };

            await services.upDateTask(id, updatedTask);

            // Обновляем локальное состояние данных
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
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };


    const PostDataFun = () => {
        console.log(postTasks);
        console.log(postDate);
        console.log(postCompleted);
        const postReqTask = async () => {
            const response = await services.postTasks(postTasks, postDate, postCompleted)
            console.log(response);

        }
        postReqTask()

    }


    return (
        <div className='container'>
            <Select
                style={{ marginRight: 10, marginBottom: 50 }}
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
            <Button type="primary" onClick={showDrawer}>Создать Задания</Button>
            <Table dataSource={data} rowKey="id">
                <Column title="Номер" dataIndex="id" key="id" />
                <Column title="Название" dataIndex="title" key="title" />
                <Column title="До Выполнения" dataIndex="date" key="date" />
                <Column title="Статус" dataIndex="completed" key="completed" render={(text) => (
                    <span>{text ? 'Выполнено' : 'Не выполнено'}</span>
                )} />
                <Column
                    title="Статус выполнения"
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
            <Drawer title="Basic Drawer" onClose={onClose} open={open}>
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
                        onChange={(e) => setPostTasks(e.target.value)}
                        label="Названия Задача"
                        name="username"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item

                        label="A super long label text"
                        name="password"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <DatePicker onChange={(date) => {
                            const formattedDate = date ? date.toISOString().split('T')[0] : null; // Форматирование в YYYY-MM-DD
                            setPostDate(formattedDate)
                        }} />
                    </Form.Item>
                    <Form.Item
                        label="A super long label text"
                        name="completed"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item label=" ">
                        <Button type="primary" htmlType="submit" onClick={() => { PostDataFun() }}>
                            Создать
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default Home;
