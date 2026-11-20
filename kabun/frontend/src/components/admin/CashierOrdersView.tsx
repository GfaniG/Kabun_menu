import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  CheckCircle,
  Clock,
  Coffee,
  Receipt,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  useOrders,
  useServiceRequests,
  useUpdateOrderStatus,
  useUpdateServiceRequestStatus,
  useCashierSummary,
} from '../../hooks/useMenu';
import { CustomerOrder, ServiceRequest } from '../../types/menu';
import { playOrderChime, playWaiterCallBell } from '../../utils/audioChime';
import { Button } from '../ui/Button';

export const CashierOrdersView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'active' | 'PENDING' | 'PREPARING' | 'SERVED' | 'COMPLETED' | 'all'>('active');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('kabun_cashier_sound') !== 'disabled';
  });

  const { data: orders = [], isLoading: isOrdersLoading, refetch: refetchOrders } = useOrders(statusFilter);
  const { data: serviceRequests = [], refetch: refetchRequests } = useServiceRequests('PENDING');
  const { data: summary } = useCashierSummary();

  const updateOrderStatusMutation = useUpdateOrderStatus();
  const updateServiceRequestMutation = useUpdateServiceRequestStatus();

  // Track previous pending counts to trigger audio chimes on new events
  const lastAlertsCountRef = useRef<number>(0);
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    if (!summary) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      lastAlertsCountRef.current = summary.totalPendingAlerts;
      return;
    }

    // If new alerts arrived and sound is enabled, play chime!
    if (summary.totalPendingAlerts > lastAlertsCountRef.current && soundEnabled) {
      if (summary.pendingRequestsCount > 0 && summary.latestRequest) {
        playWaiterCallBell();
      } else {
        playOrderChime();
      }
    }

    lastAlertsCountRef.current = summary.totalPendingAlerts;
  }, [summary, soundEnabled]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('kabun_cashier_sound', next ? 'enabled' : 'disabled');
    if (next) playOrderChime();
  };

  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    await updateOrderStatusMutation.mutateAsync({ id: orderId, status: nextStatus });
  };

  const handleResolveRequest = async (requestId: string) => {
    await updateServiceRequestMutation.mutateAsync({ id: requestId, status: 'COMPLETED' });
  };

  // Group orders count
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const servedOrders = orders.filter((o) => o.status === 'SERVED');

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls Bar */}
      <div className="bg-[#133834] border border-[#1D4D47] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0E2F2C] border border-[#1D4D47] flex items-center justify-center text-[#E5CFAF]">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                Cashier & Barista Station
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live 3s Sync
              </span>
            </div>
            <p className="text-xs text-[#C5D5D3]">
              Real-time feed for customer table orders, waiter calls, and bill requests.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-headline font-bold uppercase tracking-wider transition-all border ${
              soundEnabled
                ? 'bg-[#E5CFAF] text-[#0E2F2C] border-[#E5CFAF] shadow-[0_0_15px_rgba(229,207,175,0.3)]'
                : 'bg-[#0E2F2C] text-[#C5D5D3] border-[#1D4D47]'
            }`}
            title={soundEnabled ? 'Click to Mute Alert Chime' : 'Click to Enable Alert Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
          </button>

          <button
            onClick={() => {
              playOrderChime();
              setTimeout(playWaiterCallBell, 400);
            }}
            className="px-2.5 py-2 rounded-xl text-xs font-headline font-semibold text-[#C5D5D3] hover:text-[#E5CFAF] bg-[#0E2F2C] border border-[#1D4D47] transition-colors"
            title="Test Chime Audio"
          >
            Test Bell
          </button>

          <button
            onClick={() => {
              refetchOrders();
              refetchRequests();
            }}
            className="p-2 rounded-xl text-[#C5D5D3] hover:text-[#E5CFAF] bg-[#0E2F2C] border border-[#1D4D47] transition-colors"
            title="Force Refresh Feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Service Bell Alerts (Calling Waiter / Requesting Bill) */}
      {serviceRequests.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h3 className="font-headline text-xs uppercase tracking-wider text-amber-300 font-bold">
              Urgent Service Bells ({serviceRequests.length} Active Call{serviceRequests.length > 1 ? 's' : ''})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {serviceRequests.map((req) => (
              <div
                key={req.id}
                className="bg-amber-950/40 border-2 border-amber-500/50 rounded-2xl p-4 shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-[#0E2F2C] font-headline text-xs font-extrabold uppercase tracking-wider">
                      TABLE {req.tableNumber}
                    </span>
                    <span className="text-[11px] text-amber-200/80 font-mono">
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="font-headline text-sm font-bold text-white flex items-center gap-1.5 pt-1">
                    {req.type === 'REQUEST_BILL' ? (
                      <>
                        <Receipt className="w-4 h-4 text-amber-400" />
                        <span>Requested Bill / Receipt</span>
                      </>
                    ) : req.type === 'WATER_REFILL' ? (
                      <>
                        <Coffee className="w-4 h-4 text-cyan-400" />
                        <span>Water Refill Requested</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        <span>Calling Barista / Waiter</span>
                      </>
                    )}
                  </p>

                  {req.notes && (
                    <p className="text-xs text-amber-200/90 italic bg-amber-900/40 px-2 py-1 rounded-md">
                      "{req.notes}"
                    </p>
                  )}
                  {req.paymentMethod && (
                    <p className="text-[11px] text-amber-200/80">
                      Payment preference: <strong className="text-white">{req.paymentMethod}</strong>
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="yellow"
                  onClick={() => handleResolveRequest(req.id)}
                  className="shrink-0 text-xs font-bold"
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Attended
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#1D4D47]/60">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { key: 'active', label: 'Active Orders', count: pendingOrders.length + preparingOrders.length + servedOrders.length },
            { key: 'PENDING', label: 'New / Pending', count: pendingOrders.length },
            { key: 'PREPARING', label: 'Preparing', count: preparingOrders.length },
            { key: 'SERVED', label: 'Served', count: servedOrders.length },
            { key: 'COMPLETED', label: 'Completed' },
            { key: 'all', label: 'All Orders' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-headline uppercase tracking-wider font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === tab.key
                  ? 'bg-[#E5CFAF] text-[#0E2F2C] shadow-[0_0_15px_rgba(229,207,175,0.25)]'
                  : 'bg-[#133834] text-[#C5D5D3] hover:text-white border border-[#1D4D47]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    statusFilter === tab.key ? 'bg-[#0E2F2C] text-[#E5CFAF]' : 'bg-[#0E2F2C] text-emerald-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#C5D5D3] font-mono">
          {orders.length} order{orders.length === 1 ? '' : 's'} displayed
        </span>
      </div>

      {/* Orders Feed Grid */}
      {isOrdersLoading ? (
        <div className="py-20 text-center text-[#C5D5D3] space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#E5CFAF] animate-spin mx-auto" />
          <p className="text-xs font-headline uppercase tracking-wider">Syncing live roastery orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#133834]/60 border border-[#1D4D47] rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0E2F2C] border border-[#1D4D47] flex items-center justify-center text-[#E5CFAF] mx-auto">
            <Coffee className="w-6 h-6 opacity-60" />
          </div>
          <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider">
            No orders in this view
          </h4>
          <p className="text-xs text-[#C5D5D3] max-w-sm mx-auto">
            When guests at tables 1–15 browse their phones and tap "Send Order", tickets will appear here with live sound alerts!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => {
            const isPending = order.status === 'PENDING';
            const isPreparing = order.status === 'PREPARING';
            const isServed = order.status === 'SERVED';
            const isCompleted = order.status === 'COMPLETED';

            const statusBadgeClasses = isPending
              ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
              : isPreparing
              ? 'bg-blue-950/80 border-blue-500/50 text-blue-300'
              : isServed
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              : 'bg-zinc-800/80 border-zinc-600 text-zinc-300';

            return (
              <div
                key={order.id}
                className={`bg-[#133834] border rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all ${
                  isPending
                    ? 'border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'border-[#1D4D47]'
                }`}
              >
                {/* Header */}
                <div className="space-y-2 border-b border-[#1D4D47] pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-[#E5CFAF] text-[#0E2F2C] font-headline text-sm font-black uppercase tracking-wider">
                        TABLE {order.tableNumber || '?'}
                      </span>
                      <span className="font-mono text-xs text-[#C5D5D3] font-bold">
                        {order.orderNumber}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-headline font-bold uppercase tracking-wider ${statusBadgeClasses}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#A2B8B5]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>
                      {order.items.reduce((acc, it) => acc + it.quantity, 0)} item{order.items.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2.5 flex-1">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#0B2523] border border-[#1D4D47] text-[#E5CFAF] font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                            {it.quantity}x
                          </span>
                          <span className="font-medium text-white">{it.name}</span>
                        </div>
                        {it.notes && (
                          <p className="text-[11px] text-[#A2B8B5] italic pl-7">
                            ↳ Note: {it.notes}
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-[#E5CFAF] shrink-0 font-bold">
                        {(it.price * it.quantity).toLocaleString()} ETB
                      </span>
                    </div>
                  ))}

                  {order.customerNotes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#0B2523] border border-[#1D4D47] text-xs text-[#E5CFAF]">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#A2B8B5] block">
                        Customer Instructions:
                      </span>
                      <p className="italic">"{order.customerNotes}"</p>
                    </div>
                  )}
                </div>

                {/* Footer Total & Actions */}
                <div className="pt-3 border-t border-[#1D4D47] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-headline font-bold tracking-wider text-[#C5D5D3]">
                      Total Bill
                    </span>
                    <span className="font-headline text-base sm:text-lg font-black font-mono text-white">
                      {order.totalAmount.toLocaleString()} <span className="text-xs font-normal text-[#E5CFAF]">ETB</span>
                    </span>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    {isPending && (
                      <>
                        <Button
                          size="sm"
                          variant="yellow"
                          className="flex-1 font-bold text-xs"
                          onClick={() => handleStatusChange(order.id, 'PREPARING')}
                          isLoading={updateOrderStatusMutation.isPending}
                        >
                          Accept & Brew ☕
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs text-red-300 hover:text-red-200"
                          onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {isPreparing && (
                      <Button
                        size="sm"
                        variant="yellow"
                        className="w-full font-bold text-xs !bg-blue-600 hover:!bg-blue-500 !text-white"
                        onClick={() => handleStatusChange(order.id, 'SERVED')}
                        isLoading={updateOrderStatusMutation.isPending}
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                      >
                        Mark Served To Table ✓
                      </Button>
                    )}

                    {isServed && (
                      <Button
                        size="sm"
                        variant="yellow"
                        className="w-full font-bold text-xs !bg-emerald-600 hover:!bg-emerald-500 !text-white"
                        onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                        isLoading={updateOrderStatusMutation.isPending}
                        leftIcon={<Receipt className="w-3.5 h-3.5" />}
                      >
                        Mark Paid & Close Bill 💰
                      </Button>
                    )}

                    {isCompleted && (
                      <div className="w-full py-1.5 text-center text-xs text-emerald-400 font-headline uppercase font-bold tracking-wider">
                        ✓ Order Settled & Closed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
