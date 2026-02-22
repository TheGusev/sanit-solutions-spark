import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ServiceQuiz from '../ServiceQuiz';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { functions: { invoke: vi.fn().mockResolvedValue({ data: { success: true }, error: null }) } },
}));
vi.mock('@/contexts/TrafficContext', () => ({
  useTraffic: () => ({ context: { intent: 'test', sessionId: '123' } }),
}));
vi.mock('@/lib/analytics', () => ({ trackGoal: vi.fn() }));

const mockSteps = [
  { question: 'Тип помещения?', options: ['Квартира', 'Офис', 'Склад'] },
  { question: 'Площадь?', options: ['До 30м²', '30-60м²', 'Более 60м²'] },
];

describe('ServiceQuiz', () => {
  const renderQuiz = () =>
    render(
      <MemoryRouter>
        <ServiceQuiz steps={mockSteps} serviceSlug="dezinsekciya" serviceTitle="Дезинсекция" />
      </MemoryRouter>
    );

  it('renders without crashing', () => {
    renderQuiz();
    expect(screen.getByText('Рассчитать стоимость')).toBeInTheDocument();
  });

  it('shows correct pluralization for 2 questions', () => {
    renderQuiz();
    expect(screen.getByText(/2 вопроса/)).toBeInTheDocument();
  });

  it('displays first question', () => {
    renderQuiz();
    expect(screen.getByText('Тип помещения?')).toBeInTheDocument();
  });
});
