import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceTariffs from '../ServiceTariffs';

const mockTariffs = [
  { name: 'Эконом', price: 'от 1500₽', features: ['Обработка до 30м²', 'Гарантия 3 мес'] },
  { name: 'Стандарт', price: 'от 2500₽', popular: true, features: ['Обработка до 60м²', 'Гарантия 6 мес'] },
  { name: 'Премиум', price: 'от 4000₽', features: ['Обработка до 100м²', 'Гарантия до 3 лет'] },
];

describe('ServiceTariffs', () => {
  it('renders three tariff cards', () => {
    render(<ServiceTariffs tariffs={mockTariffs} serviceTitle="Дезинсекция" serviceAccusative="дезинсекцию" />);
    expect(screen.getAllByText(/Заказать/)).toHaveLength(3);
  });

  it('shows "Популярный" badge on popular tariff', () => {
    render(<ServiceTariffs tariffs={mockTariffs} serviceTitle="Дезинсекция" serviceAccusative="дезинсекцию" />);
    expect(screen.getByText('Популярный')).toBeInTheDocument();
  });

  it('returns null for empty tariffs', () => {
    const { container } = render(<ServiceTariffs tariffs={[]} serviceTitle="Тест" />);
    expect(container.innerHTML).toBe('');
  });
});
