# Roadmap Компонентов (IoT Дашборд)

Этот файл служит трекером готовности компонентов для покрытия задач мониторинга (Live), аналитики (Time-Series), логирования и конфигурации.

## 1. Ядро и Лейаут (Core Layout)

| Компонент | Статус | Связь с Backend | Путь | Описание |
| :--- | :---: | :---: | :--- | :--- |
| **AppLayoutComponent** | ⏳ ОЖИДАЕТ | ⚪ НЕ ТРЕБУЕТСЯ | `src/app/core/layout/...` | Главная оболочка дашборда с боковой панелью навигации (Sidebar) и верхним меню (Topbar) |
| **AlertNotificationComponent** | ⏳ ОЖИДАЕТ | 🔴 ОЖИДАЕТ | `src/app/core/alerts/...` | Глобальный обработчик пушей от WebSocket (ToastModule) |

## 2. Дашборд реального времени (Live Dashboard)

| Компонент | Статус | Связь с Backend | Путь | Описание |
| :--- | :---: | :---: | :--- | :--- |
| **LiveOccupancyComponent** | ✅ ГОТОВ | 🟡 MOCK (RxJS) | `src/app/features/live-occupancy/` | Ключевой счетчик посетителей (Compliance). Использует `MeterGroupModule` и `CardModule`. |
| **FacilityStatusComponent** | ⏳ ОЖИДАЕТ | 🔴 ОЖИДАЕТ | `src/app/features/facility-status/...` | Индикаторы климатических систем (HVAC) и освещения. |

## 3. Аналитика (Analytics & Time-Series)

| Компонент | Статус | Связь с Backend | Путь | Описание |
| :--- | :---: | :---: | :--- | :--- |
| **TrafficChartComponent** | ⏳ ОЖИДАЕТ | 🔴 ОЖИДАЕТ | `src/app/features/analytics/traffic-chart/...` | Графики входов/выходов по времени (Chart.js / ChartModule). |
| **ConversionMetricsComponent**| ⏳ ОЖИДАЕТ | 🔴 ОЖИДАЕТ | `src/app/features/analytics/conversion/...` | KPI-метрики для Retail Analytics. Панели конверсии. |

## 4. Логирование и Телеметрия (Data Tables)

| Компонент | Статус | Связь с Backend | Путь | Описание |
| :--- | :---: | :---: | :--- | :--- |
| **PassageLogsComponent** | ⏳ ОЖИДАЕТ | 🔴 ОЖИДАЕТ | `src/app/features/logs/passage-logs/...` | Журнал событий прохода (TableModule + VirtualScroll + CDC поток). |
| **HardwareStatusComponent** | ⏳ ОЖИДАЕТ | 🔴 ОЖИДАЕТ | `src/app/features/logs/hardware-status/...` | Таблица состояния контроллеров ESP32-C3 и матриц ToF-сенсоров. |

## 5. Конфигурация (Configuration & Forms)

| Компонент | Статус | Связь с Backend | Путь | Описание |
| :--- | :---: | :---: | :--- | :--- |
| **ComplianceSettingsComponent**| ⏳ ОЖИДАЕТ | 🔴 ОЖИДАЕТ | `src/app/features/config/compliance/...` | Формы установки лимитов вместимости зон (SliderModule). |
| **NodeCalibrationComponent** | ⏳ ОЖИДАЕТ | 🔴 ОЖИДАЕТ | `src/app/features/config/calibration/...` | Интерфейс настройки пространственной матрицы микроконтроллеров. |
