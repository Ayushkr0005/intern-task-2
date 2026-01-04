import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import CoursesPage from '../pages/CoursesPage';

vi.mock('../lib/api', () => {
  return {
    apiFetch: vi.fn(async () => ({ courses: [] })),
  };
});

describe('CoursesPage', () => {
  it('renders heading', () => {
    render(
      <MemoryRouter>
        <CoursesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Courses')).toBeInTheDocument();
  });
});
