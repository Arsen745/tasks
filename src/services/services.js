import tasks from "../axios/axios";

class Task {
    async getTasks() {
        try {
            const response = await tasks('api/tasks/')
            return response.data
        } catch (error) {
            console.log(error);

        }

    }
    async getCompleted(val) {
        try {
            const response = await tasks(`api/tasks/completed/?completed=${val}`);
            return response.data
        } catch (error) {
            console.error("Ошибка при получении завершенных задач:", error);
        }
    }


    async upDateTask(id, taskData) {
        const response = await tasks.patch(`api/tasks/${id}/`, taskData);
        return response.data;
    }
    async postTasks(title, date, completed) {
        try {
            const response = await tasks.post(`api/tasks/`, { // используем POST для создания новой задачи
                title: title,     // Заголовок задачи
                date: date,       // Дата
                completed: completed // Статус выполнения (true/false)
            });
            return response.data;  // Возвращаем ответ сервера
        } catch (error) {
            console.error('Ошибка при отправке POST запроса:', error);
        }
    }
}

export default new Task;