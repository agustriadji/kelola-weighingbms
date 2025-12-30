'use client';

import { useEffect } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useHWConfig, HwTabEnum } from '@/hooks/useHWConfig.hook';
import { Permissions } from '@/types/rbac';

export default function HwConfigurationPage() {
  const {
    allowedAreas,
    selectedTab,
    setSelectedTab,
    formData,
    setFormData,
    loading,
    error,
    save,
    getByArea,
    getGeneralApi,
    cancel,
    test,
    isDisabled,
  } = useHWConfig();

  useEffect(() => {
    if (selectedTab === HwTabEnum.GENERAL) {
      getGeneralApi();
    } else {
      getByArea(selectedTab as any);
    }
  }, [selectedTab]);

  return (
    <ProtectedRoute requiredPermissions={[Permissions.MANAGE_SYSTEM]}>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Configuration connection HW</h1>
        <p className="text-sm text-gray-600 mb-6">
          Configure hardware connections for each weighing bridge area. Set up API endpoints for
          gate control, camera systems, and MQTT topics for weight data communication.
        </p>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-48 space-y-2">
            <button
              onClick={() => setSelectedTab(HwTabEnum.GENERAL)}
              className={`w-full px-4 py-3 text-left rounded ${
                selectedTab === HwTabEnum.GENERAL
                  ? 'bg-purple-200 text-purple-800 font-medium'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              GENERAL
            </button>
            {allowedAreas.includes('REGISTERING') && (
              <button
                onClick={() => setSelectedTab(HwTabEnum.REGISTERING)}
                className={`w-full px-4 py-3 text-left rounded ${
                  selectedTab === HwTabEnum.REGISTERING
                    ? 'bg-purple-200 text-purple-800 font-medium'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                REGISTER
              </button>
            )}
            {allowedAreas.includes('WEIGHING_IN') && (
              <button
                onClick={() => setSelectedTab(HwTabEnum.WEIGHING_IN)}
                className={`w-full px-4 py-3 text-left rounded ${
                  selectedTab === HwTabEnum.WEIGHING_IN
                    ? 'bg-purple-200 text-purple-800 font-medium'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                W-IN
              </button>
            )}
            {allowedAreas.includes('WEIGHING_OUT') && (
              <button
                onClick={() => setSelectedTab(HwTabEnum.WEIGHING_OUT)}
                className={`w-full px-4 py-3 text-left rounded ${
                  selectedTab === HwTabEnum.WEIGHING_OUT
                    ? 'bg-purple-200 text-purple-800 font-medium'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                W-OUT
              </button>
            )}
          </div>

          {/* Form Area */}
          <div className="flex-1 bg-gray-100 p-6 rounded">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {selectedTab === HwTabEnum.GENERAL ? (
                /* GENERAL Tab - Hardware Controller Host */
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">HARDWARE CONTROLLER HOST</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Configure the main hardware controller API endpoint. This will be used by all
                    areas (Register, Weighing-In, Weighing-Out).
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.hardware_api || ''}
                      onChange={(e) => setFormData({ ...formData, hardware_api: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      placeholder="http://192.168.1.95:8081"
                    />
                    <button
                      onClick={() => test('hardware')}
                      className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Test
                    </button>
                  </div>
                </div>
              ) : (
                /* Area Tabs - Index Selection */
                <>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">HARDWARE INDEX CONFIGURATION</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Select hardware device index for {selectedTab} area. Controller will use these
                      indexes for Gate, Camera & Lamp control.
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      {/* Gate Index */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2">Gate Index</label>
                        <select
                          value={formData.gate || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gate: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                          <option value="">Select Gate</option>
                          {[1, 2, 3].map((i) => (
                            <option key={i} value={i}>
                              Gate {i}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Camera Index */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2">
                          Camera Index
                        </label>
                        <select
                          value={formData.camera || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              camera: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                          <option value="">Select Camera</option>
                          {[1, 2, 3].map((i) => (
                            <option key={i} value={i}>
                              Camera {i}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Lamp Index */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2">Lamp Index</label>
                        <select
                          value={formData.lamp || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lamp: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                          <option value="">Select Lamp</option>
                          {[1, 2, 3].map((i) => (
                            <option key={i} value={i}>
                              Lamp {i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* MQTT Topics - Only for WEIGHING areas */}
                  {selectedTab !== HwTabEnum.REGISTERING && (
                    <div>
                      <h3 className="font-bold text-gray-800 mb-2">MQTT TOPICS</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Configure MQTT topics for real-time weight data communication.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Get Weight Topic
                          </label>
                          <input
                            type="text"
                            value={formData.topic_get_weight || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, topic_get_weight: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            placeholder="weighing/get/weight"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Post Command Topic
                          </label>
                          <input
                            type="text"
                            value={formData.topic_post_command || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, topic_post_command: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            placeholder="weighing/post/command"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-8">
              <button
                onClick={cancel}
                className="px-6 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={isDisabled}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
