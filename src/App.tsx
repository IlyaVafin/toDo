import React, { useState } from 'react'
import './App.css'
type Task = {
	text: string
	completed: boolean
}

const App: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([])
	const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
	const [newTask, setNewTask] = useState<string>('')

	const addTask = () => {
		if (newTask.trim() === '') return
		let newList = [...tasks]
		setTasks([...newList, { text: newTask, completed: false }])
		setNewTask('')
	}

	const clearCompleted = () => {
		setTasks(tasks.filter(task => !task.completed))
	}

	const toggleCompetedTask = (index: number) => {
		const updateTask = [...tasks]
		updateTask[index].completed = !updateTask[index].completed
		setTasks(updateTask)
	}

	const filteredTasks: Task[] = tasks.filter(task => {
		if (filter === 'completed') return task.completed
		if (filter === 'active') return !task.completed
		return true
	})

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			addTask()
		}
	}

	const remainingCount: number = tasks.filter(task => !task.completed).length

	return (
		<>
			<h1>TODOS</h1>
			<div className='todo'>
				<input
					type='text'
					value={newTask}
					onChange={e => setNewTask(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder='What needs to be done?'
				/>
				{filteredTasks.length < 1 ? <p>Ничего не найдено</p> :
					<ul className='todo__tasks'>
						{filteredTasks.map((item, index) => (
							<li key={index}>
								<label className='custom-checkbox'>
									<input
										onChange={() => toggleCompetedTask(index)}
										type='checkbox'
										checked={item.completed}
									/>
									<span className='checkmark'>{item.completed && <img width={20} height={20} src='/toDo/completed.svg'/>}</span>
                  <span className={item.completed ? 'completed-task' : ''}>
									{item.text}
								</span>
								</label>
							</li>
						))}
					</ul>
				}
				<nav className='todo__nav'>
					<p>{remainingCount} items left</p>

					<div className='nav__main-buttons'>

						<button
							style={{ border: filter === 'all' ? '1px solid red' : '' }}
							onClick={() => setFilter('all')}
						>
							All
						</button>
						<button
							style={{ border: filter === 'active' ? '1px solid red' : '' }}
							onClick={() => setFilter('active')}
						>
							Active
						</button>
						<button
							style={{ border: filter === 'completed' ? '1px solid red' : '' }}
							onClick={() => setFilter('completed')}
						>
							Completed
						</button>
					</div>

					<div className='clear-completed__btn'>
						<button onClick={clearCompleted}>Clear completed</button>
					</div>

				</nav>
			</div>
		</>
	)
}

export default App
