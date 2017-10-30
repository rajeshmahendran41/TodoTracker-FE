export interface Todo {
    id?: number;
    title: string;
    description: string;
    status? : boolean;
}

export const TodoActions = {
    'ADD' : 'addTodo',
    'EDIT' : 'editTodo',
    'CREATE' : 'createTodo',
    'UPDATE' : 'updateTodo',
    'DELETE' : 'deleteTodo',
    'CLOSE' : 'closeTodo'
}

export const TodoStatus = {
    'COMPLETED' : {
        id : 2,
        title : 'Completed'
    },
    'PENDING' : {
        id : 1,
        title : 'Pending'
    }
}