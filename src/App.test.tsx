import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('Todo App', () => {
  
  it('should add a task when pressing Enter', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    // Вводим новую задачу и нажимаем Enter
    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Проверяем, что задача появилась
    expect(screen.getByText('New task')).toBeInTheDocument();
  });

  it('should toggle task completion when checkbox is clicked', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    fireEvent.change(input, { target: { value: 'Complete task' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    const checkbox = screen.getByRole('checkbox');
    
    // Проверяем, что задача ещё не выполнена
    expect(checkbox).not.toBeChecked();

    // Кликаем на чекбокс и проверяем его состояние
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Проверяем, что текст задачи стал стилизован
    expect(screen.getByText('Complete task')).toHaveClass('completed-task');
  });

  it('should show no tasks found when filtering with no active tasks', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('What needs to be done?');

    fireEvent.change(input, { target: { value: 'Completed task' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Завершаем задачу
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Фильтруем только активные задачи, и должны увидеть "Ничего не найдено"
    fireEvent.click(screen.getByText('Active'));
    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
  });

  it('should filter completed tasks correctly', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('What needs to be done?');

    fireEvent.change(input, { target: { value: 'Task 1' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    fireEvent.change(input, { target: { value: 'Task 2' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Завершаем вторую задачу
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    // Фильтруем выполненные задачи
    fireEvent.click(screen.getByText('Completed'));
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  it('should clear completed tasks when clicking "Clear completed"', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('What needs to be done?');

    fireEvent.change(input, { target: { value: 'Task to clear' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox); // Завершаем задачу

    fireEvent.click(screen.getByText('Clear completed'));

    // Проверяем, что задача удалена
    expect(screen.queryByText('Task to clear')).not.toBeInTheDocument();
  });

  it('should show remaining tasks count', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('What needs to be done?');

    fireEvent.change(input, { target: { value: 'Task 1' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    fireEvent.change(input, { target: { value: 'Task 2' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Завершаем одну задачу
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    // Проверяем, что оставшиеся задачи отображаются правильно
    expect(screen.getByText('1 items left')).toBeInTheDocument();
  });

});
