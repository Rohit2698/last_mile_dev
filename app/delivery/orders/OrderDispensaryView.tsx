"use client"

import { Order } from "@/app/api/react-query/orders"
import { COLUMN_COLORS, formatDate, formatStatus, getStatusStyle } from "./util"
import { OrderActionsMenu } from "./OrderActionsMenu"

interface OrderDispensaryViewProps {
  orders: Order[]
  onViewOrder?: (order: Order) => void
  onEditOrder?: (order: Order) => void
  onDeleteOrder?: (order: Order) => void
}

interface DispensaryGroup {
  id: string
  name: string
  orders: Order[]
}

export const OrderDispensaryView = ({
  orders,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
}: OrderDispensaryViewProps) => {
  const groupMap = new Map<string, DispensaryGroup>()

  for (const order of orders) {
    const id = order.dispensaryId
    const name = order.dispensary?.name ?? "Unknown Dispensary"
    if (!groupMap.has(id)) {
      groupMap.set(id, { id, name, orders: [] })
    }
    groupMap.get(id)!.orders.push(order)
  }

  const groups = Array.from(groupMap.values())

  if (groups.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="flex gap-4"
        style={{ minWidth: `${groups.length * 288}px` }}
      >
        {groups.map((group, idx) => {
          const color = COLUMN_COLORS[idx % COLUMN_COLORS.length]
          return (
            <div
              key={group.id}
              className="flex-1 cursor-pointer min-w-68  max-w-[320px] flex flex-col gap-3"
            >
              {/* Column header */}
              <div
                className={`rounded-lg px-3 py-2 flex items-center gap-2 ${color.header}`}
              >
                <span
                  className={`text-white text-xs font-medium rounded-full w-5.5 h-5.5 flex items-center justify-center shrink-0 ${color.badge}`}
                >
                  {group.orders.length}
                </span>
                <span className="font-medium text-sm truncate">
                  {group.name}
                </span>
              </div>

              {/* Order cards */}
              <div className="flex h-[calc(100vh-250px)] overflow-auto flex-col gap-2">
                {group.orders.map(order => (
                  <div
                    key={order.id}
                    onClick={() => onViewOrder?.(order)}
                    className={`w-full text-left bg-card border border-border/50 border-l-[3px] ${color.border} rounded-lg p-3 hover:shadow-sm transition-shadow flex flex-col gap-2`}
                  >
                    {/* Top row: name + status badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate text-foreground">
                          {order.customerName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusStyle(order.status)}`}
                        >
                          {formatStatus(order.status)}
                        </p>
                        <OrderActionsMenu
                          order={order}
                          onViewDetails={onViewOrder}
                          onEditDetails={onEditOrder}
                          onDeleteOrder={onDeleteOrder}
                        />
                      </div>
                    </div>
                    {/* Detail grid */}
                    <div className="border-t border-border/40 pt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Date
                        </p>
                        <p className="text-xs font-medium text-foreground">
                          {formatDate(order.deliveryDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Time slot
                        </p>
                        <p className="text-xs font-medium text-foreground">
                          {order.primaryTimeSlot}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Type
                        </p>
                        <p className="text-xs font-medium text-foreground">
                          {order.customerType === "MED"
                            ? "Medical"
                            : "Recreational"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">
                          Items
                        </p>
                        <p className="text-xs font-medium text-foreground">
                          {order.noOfItems}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
