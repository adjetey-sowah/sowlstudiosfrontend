import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  Database, 
  Wifi, 
  Clock, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Monitor,
  Cpu,
  HardDrive,
  MemoryStick
} from 'lucide-react';
import { systemAPI, handleApiError } from '../../utils/api';

interface HealthData {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

interface InfoData {
  application: string;
  version: string;
  description: string;
  contact: string;
}

interface ActuatorHealth {
  status: string;
  components?: {
    [key: string]: {
      status: string;
      details?: any;
    };
  };
}

interface ActuatorInfo {
  app?: {
    name?: string;
    version?: string;
    description?: string;
  };
  build?: {
    version?: string;
    time?: string;
    artifact?: string;
    group?: string;
  };
  java?: {
    version?: string;
    vendor?: string;
    runtime?: {
      name?: string;
      version?: string;
    };
  };
  git?: {
    branch?: string;
    commit?: {
      id?: string;
      time?: string;
    };
  };
}

interface ActuatorMetrics {
  names?: string[];
}

interface MetricDetail {
  name: string;
  description?: string;
  baseUnit?: string;
  measurements?: Array<{
    statistic: string;
    value: number;
  }>;
  availableTags?: Array<{
    tag: string;
    values: string[];
  }>;
}

interface EnvironmentInfo {
  activeProfiles?: string[];
  propertySources?: Array<{
    name: string;
    properties?: Record<string, any>;
  }>;
}

const SystemHealth: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [infoData, setInfoData] = useState<InfoData | null>(null);
  const [actuatorHealth, setActuatorHealth] = useState<ActuatorHealth | null>(null);
  const [actuatorInfo, setActuatorInfo] = useState<ActuatorInfo | null>(null);
  const [metrics, setMetrics] = useState<ActuatorMetrics | null>(null);
  const [keyMetrics, setKeyMetrics] = useState<Record<string, MetricDetail>>({});
  const [environment, setEnvironment] = useState<EnvironmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchAllData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all endpoints in parallel
      const [
        healthResponse,
        infoResponse,
        actuatorHealthResponse,
        actuatorInfoResponse,
        metricsResponse,
        environmentResponse
      ] = await Promise.allSettled([
        fetchCustomHealth(),
        fetchCustomInfo(),
        fetchActuatorHealth(),
        fetchActuatorInfo(),
        fetchActuatorMetrics(),
        fetchEnvironment()
      ]);

      // Handle custom health endpoint
      if (healthResponse.status === 'fulfilled') {
        setHealthData(healthResponse.value);
      }

      // Handle custom info endpoint
      if (infoResponse.status === 'fulfilled') {
        setInfoData(infoResponse.value);
      }

      // Handle actuator health endpoint
      if (actuatorHealthResponse.status === 'fulfilled') {
        setActuatorHealth(actuatorHealthResponse.value);
      }

      // Handle actuator info endpoint
      if (actuatorInfoResponse.status === 'fulfilled') {
        setActuatorInfo(actuatorInfoResponse.value);
      }

      // Handle metrics endpoint
      if (metricsResponse.status === 'fulfilled') {
        setMetrics(metricsResponse.value);
        // Fetch key metrics details
        await fetchKeyMetricsDetails(metricsResponse.value);
      }

      // Handle environment endpoint
      if (environmentResponse.status === 'fulfilled') {
        setEnvironment(environmentResponse.value);
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomHealth = async (): Promise<HealthData> => {
    const response = await systemAPI.getHealth();
    return response.data;
  };

  const fetchCustomInfo = async (): Promise<InfoData> => {
    const response = await systemAPI.getInfo();
    return response.data;
  };

  const fetchActuatorHealth = async (): Promise<ActuatorHealth> => {
    const actuatorBaseUrl = import.meta.env.VITE_ACTUATOR_BASE_URL || 'http://localhost:8000/actuator';
    const response = await fetch(`${actuatorBaseUrl}/health`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  };

  const fetchActuatorInfo = async (): Promise<ActuatorInfo> => {
    const actuatorBaseUrl = import.meta.env.VITE_ACTUATOR_BASE_URL || 'http://localhost:8000/actuator';
    const response = await fetch(`${actuatorBaseUrl}/info`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  };

  const fetchActuatorMetrics = async (): Promise<ActuatorMetrics> => {
    const actuatorBaseUrl = import.meta.env.VITE_ACTUATOR_BASE_URL || 'http://localhost:8000/actuator';
    const response = await fetch(`${actuatorBaseUrl}/metrics`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  };

  const fetchEnvironment = async (): Promise<EnvironmentInfo> => {
    const actuatorBaseUrl = import.meta.env.VITE_ACTUATOR_BASE_URL || 'http://localhost:8000/actuator';
    const response = await fetch(`${actuatorBaseUrl}/env`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  };

  const fetchKeyMetricsDetails = async (metricsData: ActuatorMetrics) => {
    if (!metricsData.names) return;

    const keyMetricNames = [
      'jvm.memory.used',
      'jvm.memory.max',
      'system.cpu.usage',
      'process.cpu.usage',
      'jvm.threads.live',
      'jvm.gc.pause',
      'http.server.requests',
      'jdbc.connections.active',
      'jdbc.connections.max',
      'system.load.average.1m'
    ].filter(name => metricsData.names!.includes(name));

    const actuatorBaseUrl = import.meta.env.VITE_ACTUATOR_BASE_URL || 'http://localhost:8000/actuator';
    const metricDetails: Record<string, MetricDetail> = {};

    for (const metricName of keyMetricNames) {
      try {
        const response = await fetch(`${actuatorBaseUrl}/metrics/${metricName}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          metricDetails[metricName] = await response.json();
        }
      } catch (error) {
        console.warn(`Failed to fetch metric ${metricName}:`, error);
      }
    }

    setKeyMetrics(metricDetails);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'UP':
        return 'text-green-600 bg-green-100';
      case 'DOWN':
        return 'text-red-600 bg-red-100';
      case 'UNKNOWN':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'UP':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'DOWN':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getMetricValue = (metric: MetricDetail, statistic: string = 'VALUE'): number | null => {
    const measurement = metric.measurements?.find(m => m.statistic === statistic);
    return measurement ? measurement.value : null;
  };

  if (loading && !healthData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">System Health Monitor</h2>
          <p className="text-gray-600 mt-1">
            Real-time system status and health monitoring
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Overall Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* API Health */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            {healthData && getStatusIcon(healthData.status)}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">API Service</h3>
          <p className="text-sm text-gray-600">
            {healthData ? healthData.service : 'Loading...'}
          </p>
          {healthData && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(healthData.status)}`}>
              {healthData.status}
            </span>
          )}
        </div>

        {/* Actuator Health */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            {actuatorHealth && getStatusIcon(actuatorHealth.status)}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Spring Boot</h3>
          <p className="text-sm text-gray-600">Actuator Health</p>
          {actuatorHealth && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(actuatorHealth.status)}`}>
              {actuatorHealth.status}
            </span>
          )}
        </div>

        {/* Database Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            {actuatorHealth?.components?.db && getStatusIcon(actuatorHealth.components.db.status)}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Database</h3>
          <p className="text-sm text-gray-600">Connection Status</p>
          {actuatorHealth?.components?.db && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(actuatorHealth.components.db.status)}`}>
              {actuatorHealth.components.db.status}
            </span>
          )}
        </div>

        {/* Disk Space */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <HardDrive className="h-6 w-6 text-orange-600" />
            </div>
            {actuatorHealth?.components?.diskSpace && getStatusIcon(actuatorHealth.components.diskSpace.status)}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Disk Space</h3>
          <p className="text-sm text-gray-600">Storage Status</p>
          {actuatorHealth?.components?.diskSpace && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(actuatorHealth.components.diskSpace.status)}`}>
              {actuatorHealth.components.diskSpace.status}
            </span>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      {Object.keys(keyMetrics).length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-serif font-bold text-gray-900">Performance Metrics</h3>

          {/* Memory Usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyMetrics['jvm.memory.used'] && keyMetrics['jvm.memory.max'] && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <MemoryStick className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(
                        (getMetricValue(keyMetrics['jvm.memory.used']) || 0) /
                        (getMetricValue(keyMetrics['jvm.memory.max']) || 1)
                      )}
                    </p>
                    <p className="text-sm text-gray-500">Memory Usage</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Used:</span>
                    <span className="font-medium">{formatBytes(getMetricValue(keyMetrics['jvm.memory.used']) || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Max:</span>
                    <span className="font-medium">{formatBytes(getMetricValue(keyMetrics['jvm.memory.max']) || 0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, ((getMetricValue(keyMetrics['jvm.memory.used']) || 0) / (getMetricValue(keyMetrics['jvm.memory.max']) || 1)) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* CPU Usage */}
            {keyMetrics['system.cpu.usage'] && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Cpu className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(getMetricValue(keyMetrics['system.cpu.usage']) || 0)}
                    </p>
                    <p className="text-sm text-gray-500">System CPU</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {keyMetrics['process.cpu.usage'] && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Process CPU:</span>
                      <span className="font-medium">{formatPercentage(getMetricValue(keyMetrics['process.cpu.usage']) || 0)}</span>
                    </div>
                  )}
                  {keyMetrics['system.load.average.1m'] && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Load Average:</span>
                      <span className="font-medium">{(getMetricValue(keyMetrics['system.load.average.1m']) || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (getMetricValue(keyMetrics['system.cpu.usage']) || 0) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Thread Count */}
            {keyMetrics['jvm.threads.live'] && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {getMetricValue(keyMetrics['jvm.threads.live']) || 0}
                    </p>
                    <p className="text-sm text-gray-500">Active Threads</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>JVM thread pool status</p>
                </div>
              </div>
            )}
          </div>

          {/* Database Connections */}
          {(keyMetrics['jdbc.connections.active'] || keyMetrics['jdbc.connections.max']) && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-purple-600" />
                Database Connection Pool
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {getMetricValue(keyMetrics['jdbc.connections.active']) || 0}
                  </p>
                  <p className="text-sm text-gray-500">Active Connections</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {getMetricValue(keyMetrics['jdbc.connections.max']) || 0}
                  </p>
                  <p className="text-sm text-gray-500">Max Connections</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {keyMetrics['jdbc.connections.max'] && keyMetrics['jdbc.connections.active']
                      ? formatPercentage(
                          (getMetricValue(keyMetrics['jdbc.connections.active']) || 0) /
                          (getMetricValue(keyMetrics['jdbc.connections.max']) || 1)
                        )
                      : '0%'
                    }
                  </p>
                  <p className="text-sm text-gray-500">Pool Usage</p>
                </div>
              </div>
            </div>
          )}

          {/* HTTP Requests */}
          {keyMetrics['http.server.requests'] && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Wifi className="h-5 w-5 mr-2 text-blue-600" />
                HTTP Request Metrics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {keyMetrics['http.server.requests'].measurements?.map((measurement, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">
                      {measurement.statistic === 'COUNT'
                        ? measurement.value.toLocaleString()
                        : measurement.value.toFixed(3)
                      }
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {measurement.statistic.toLowerCase().replace('_', ' ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-amber-600" />
            Application Information
          </h3>
          <div className="space-y-4">
            {infoData && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Application:</span>
                  <span className="font-medium text-gray-900">{infoData.application}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium text-gray-900">{infoData.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-medium text-gray-900 text-right max-w-xs">{infoData.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium text-gray-900">{infoData.contact}</span>
                </div>
              </>
            )}
            
            {actuatorInfo && (
              <>
                {actuatorInfo.build && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Build Time:</span>
                    <span className="font-medium text-gray-900">
                      {actuatorInfo.build.time ? new Date(actuatorInfo.build.time).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                )}
                {actuatorInfo.java && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Java Version:</span>
                      <span className="font-medium text-gray-900">{actuatorInfo.java.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Java Vendor:</span>
                      <span className="font-medium text-gray-900">{actuatorInfo.java.vendor}</span>
                    </div>
                    {actuatorInfo.java.runtime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Runtime:</span>
                        <span className="font-medium text-gray-900">{actuatorInfo.java.runtime.name} {actuatorInfo.java.runtime.version}</span>
                      </div>
                    )}
                  </>
                )}
                {actuatorInfo.git && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Git Branch:</span>
                      <span className="font-medium text-gray-900">{actuatorInfo.git.branch}</span>
                    </div>
                    {actuatorInfo.git.commit && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Commit ID:</span>
                          <span className="font-medium text-gray-900 font-mono text-xs">{actuatorInfo.git.commit.id?.substring(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Commit Time:</span>
                          <span className="font-medium text-gray-900">{actuatorInfo.git.commit.time ? new Date(actuatorInfo.git.commit.time).toLocaleString() : 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Environment Information */}
        {environment && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Monitor className="h-5 w-5 mr-2 text-amber-600" />
              Environment Configuration
            </h3>
            <div className="space-y-4">
              {environment.activeProfiles && environment.activeProfiles.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Active Profiles</h4>
                  <div className="flex flex-wrap gap-2">
                    {environment.activeProfiles.map((profile, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {profile}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {environment.propertySources && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Configuration Sources</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {environment.propertySources.slice(0, 5).map((source, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-gray-700">{source.name}</span>
                        {source.properties && Object.keys(source.properties).length > 0 && (
                          <span className="ml-2 text-gray-500">({Object.keys(source.properties).length} properties)</span>
                        )}
                      </div>
                    ))}
                    {environment.propertySources.length > 5 && (
                      <div className="text-sm text-gray-500">
                        ... and {environment.propertySources.length - 5} more sources
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Components */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-amber-600" />
            System Components
          </h3>
          <div className="space-y-4">
            {actuatorHealth?.components && Object.entries(actuatorHealth.components).map(([key, component]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="mr-3">
                    {key === 'db' && <Database className="h-4 w-4 text-purple-600" />}
                    {key === 'diskSpace' && <HardDrive className="h-4 w-4 text-orange-600" />}
                    {key === 'ping' && <Wifi className="h-4 w-4 text-blue-600" />}
                    {!['db', 'diskSpace', 'ping'].includes(key) && <Cpu className="h-4 w-4 text-gray-600" />}
                  </div>
                  <span className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(component.status)}`}>
                  {component.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Metrics */}
      {metrics && metrics.names && metrics.names.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-amber-600" />
            Available Metrics ({metrics.names.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['JVM', 'System', 'HTTP', 'Database', 'Application', 'Other'].map(category => {
              const categoryMetrics = metrics.names!.filter(name => {
                switch (category) {
                  case 'JVM': return name.startsWith('jvm.');
                  case 'System': return name.startsWith('system.') || name.startsWith('process.');
                  case 'HTTP': return name.startsWith('http.');
                  case 'Database': return name.startsWith('jdbc.') || name.startsWith('hikaricp.');
                  case 'Application': return name.startsWith('application.') || name.startsWith('custom.');
                  default: return !name.match(/^(jvm\.|system\.|process\.|http\.|jdbc\.|hikaricp\.|application\.|custom\.)/);
                }
              });

              if (categoryMetrics.length === 0) return null;

              return (
                <div key={category} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                  <p className="text-2xl font-bold text-amber-600">{categoryMetrics.length}</p>
                  <p className="text-sm text-gray-500">metrics available</p>
                  <div className="mt-2 text-xs text-gray-400 max-h-20 overflow-y-auto">
                    {categoryMetrics.slice(0, 3).map(metric => (
                      <div key={metric} className="truncate">{metric}</div>
                    ))}
                    {categoryMetrics.length > 3 && (
                      <div>... and {categoryMetrics.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            }).filter(Boolean)}
          </div>
        </div>
      )}

      {/* Health Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-amber-600" />
          Monitoring Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">
              {healthData ? new Date(healthData.timestamp).toLocaleString() : 'N/A'}
            </p>
            <p className="text-sm text-gray-500">Last Health Check</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">30 seconds</p>
            <p className="text-sm text-gray-500">Auto-refresh Interval</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-green-600">Active</p>
            <p className="text-sm text-gray-500">Monitoring Status</p>
          </div>
        </div>

        {Object.keys(keyMetrics).length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Key Performance Indicators</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {keyMetrics['jvm.memory.used'] && keyMetrics['jvm.memory.max'] && (
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">
                    {formatPercentage((getMetricValue(keyMetrics['jvm.memory.used']) || 0) / (getMetricValue(keyMetrics['jvm.memory.max']) || 1))}
                  </p>
                  <p className="text-purple-600">Memory</p>
                </div>
              )}
              {keyMetrics['system.cpu.usage'] && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-900">
                    {formatPercentage(getMetricValue(keyMetrics['system.cpu.usage']) || 0)}
                  </p>
                  <p className="text-blue-600">CPU</p>
                </div>
              )}
              {keyMetrics['jvm.threads.live'] && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-900">
                    {getMetricValue(keyMetrics['jvm.threads.live']) || 0}
                  </p>
                  <p className="text-green-600">Threads</p>
                </div>
              )}
              {keyMetrics['jdbc.connections.active'] && (
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-orange-900">
                    {getMetricValue(keyMetrics['jdbc.connections.active']) || 0}
                  </p>
                  <p className="text-orange-600">DB Connections</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealth;
