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
  };
  java?: {
    version?: string;
    vendor?: string;
  };
}

const SystemHealth: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [infoData, setInfoData] = useState<InfoData | null>(null);
  const [actuatorHealth, setActuatorHealth] = useState<ActuatorHealth | null>(null);
  const [actuatorInfo, setActuatorInfo] = useState<ActuatorInfo | null>(null);
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
      const [healthResponse, infoResponse, actuatorHealthResponse, actuatorInfoResponse] = await Promise.allSettled([
        fetchCustomHealth(),
        fetchCustomInfo(),
        fetchActuatorHealth(),
        fetchActuatorInfo()
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
    const response = await fetch('http://localhost:8000/actuator/health', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  };

  const fetchActuatorInfo = async (): Promise<ActuatorInfo> => {
    const response = await fetch('http://localhost:8000/actuator/info', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
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
                  </>
                )}
              </>
            )}
          </div>
        </div>

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

      {/* Health Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-amber-600" />
          Health Status Timeline
        </h3>
        <div className="text-sm text-gray-600">
          <p>Last health check: {healthData ? new Date(healthData.timestamp).toLocaleString() : 'N/A'}</p>
          <p>Auto-refresh: Every 30 seconds</p>
          <p>Service uptime: Monitoring active</p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
