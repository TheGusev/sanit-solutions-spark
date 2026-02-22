import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HeroCallbackForm from '../HeroCallbackForm';

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { functions: { invoke: vi.fn().mockResolvedValue({ data: { success: true }, error: null }) } },
}));

// Mock traffic context
vi.mock('@/contexts/TrafficContext', () => ({
  useTraffic: () => ({ context: { intent: 'test', sessionId: '123' } }),
}));

// Mock analytics
vi.mock('@/lib/analytics', () => ({ trackGoal: vi.fn() }));

describe('HeroCallbackForm', () => {
  const renderForm = () =>
    render(
      <MemoryRouter>
        <HeroCallbackForm serviceSlug="dezinsekciya" />
      </MemoryRouter>
    );

  it('renders phone input and submit button', () => {
    renderForm();
    expect(screen.getByPlaceholderText(/\+7/)).toBeInTheDocument();
    expect(screen.getByText('Перезвоните мне')).toBeInTheDocument();
  });

  it('submit button is not disabled when checkbox unchecked', () => {
    renderForm();
    const btn = screen.getByText('Перезвоните мне').closest('button');
    expect(btn).not.toBeDisabled();
  });
});
