import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, useToastStore } from '../useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Clear toasts before each test
    useToastStore.getState().clearToasts();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds success toast', () => {
    const { result } = renderHook(() => useToast());
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      result.current.success('Success message');
    });

    expect(storeResult.current.toasts).toHaveLength(1);
    expect(storeResult.current.toasts[0]).toMatchObject({
      message: 'Success message',
      type: 'success'
    });
  });

  it('adds error toast', () => {
    const { result } = renderHook(() => useToast());
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      result.current.error('Error message');
    });

    expect(storeResult.current.toasts).toHaveLength(1);
    expect(storeResult.current.toasts[0]).toMatchObject({
      message: 'Error message',
      type: 'error'
    });
  });

  it('adds info toast', () => {
    const { result } = renderHook(() => useToast());
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      result.current.info('Info message');
    });

    expect(storeResult.current.toasts).toHaveLength(1);
    expect(storeResult.current.toasts[0]).toMatchObject({
      message: 'Info message',
      type: 'info'
    });
  });

  it('adds warning toast', () => {
    const { result } = renderHook(() => useToast());
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      result.current.warning('Warning message');
    });

    expect(storeResult.current.toasts).toHaveLength(1);
    expect(storeResult.current.toasts[0]).toMatchObject({
      message: 'Warning message',
      type: 'warning'
    });
  });

  it('auto-removes toast after duration', () => {
    const { result } = renderHook(() => useToast());
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      result.current.success('Auto remove test', 1000);
    });

    expect(storeResult.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(storeResult.current.toasts).toHaveLength(0);
  });

  it('uses default duration when not specified', () => {
    const { result } = renderHook(() => useToast());
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      result.current.success('Default duration test');
    });

    expect(storeResult.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(4999);
    });

    expect(storeResult.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(storeResult.current.toasts).toHaveLength(0);
  });

  it('manually removes toast', () => {
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      storeResult.current.addToast({
        message: 'Manual remove test',
        type: 'info'
      });
    });

    const toastId = storeResult.current.toasts[0].id;
    expect(storeResult.current.toasts).toHaveLength(1);

    act(() => {
      storeResult.current.removeToast(toastId);
    });

    expect(storeResult.current.toasts).toHaveLength(0);
  });

  it('clears all toasts', () => {
    const { result } = renderHook(() => useToast());
    const { result: storeResult } = renderHook(() => useToastStore());

    act(() => {
      result.current.success('Toast 1');
      result.current.error('Toast 2');
      result.current.info('Toast 3');
    });

    expect(storeResult.current.toasts).toHaveLength(3);

    act(() => {
      storeResult.current.clearToasts();
    });

    expect(storeResult.current.toasts).toHaveLength(0);
  });
});