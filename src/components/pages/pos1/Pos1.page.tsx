'use client';

import { useState, useEffect } from 'react';
import ListIncomingPage from './ListIncoming.page';
import ListOutgoingPage from './ListOutgoing.page';
import ListMiscPage from './ListMisc.page';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function Pos1Page() {
  const [active, setActive] = useState<'incoming' | 'outgoing' | 'misc'>('incoming');
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const router = useRouter();
  const { user, logout: authLogout } = useAuth();

  async function loadData() {
    const res = await fetch(`/api/pos1/${active}`);
    const data = await res.json();
    setList(data.data || []);
  }

  const handleLogout = () => {
    authLogout();
    router.push('/login');
  };

  useEffect(() => {
    setShowModal(false);
    loadData();
  }, [active]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Tab */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Evyap" width={120} height={40} />
              <div className="ml-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                Life Chemistry
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActive('incoming')}
                className={
                  active === 'incoming'
                    ? `font-semibold text-blue-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200`
                    : `text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200`
                }
              >
                Incoming
              </button>

              <button
                onClick={() => setActive('outgoing')}
                className={
                  active === 'outgoing'
                    ? `font-semibold text-blue-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200`
                    : `text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200`
                }
              >
                Outgoing
              </button>

              <button
                onClick={() => setActive('misc')}
                className={
                  active === 'misc'
                    ? `font-semibold text-blue-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200`
                    : `text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200`
                }
              >
                Miscellaneous
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="bg-white rounded-lg shadow-md p-2">
          {/* LISTS */}
          {active === 'incoming' && <ListIncomingPage data={list} refresh={loadData} />}
          {active === 'outgoing' && <ListOutgoingPage data={list} refresh={loadData} />}
          {active === 'misc' && <ListMiscPage data={list} refresh={loadData} />}
        </div>
      </div>
      <Footer />

      {/* Action Button */}
      {/* <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {active === 'incoming' && '+ Create Raw Material (Incoming)'}
          {active === 'outgoing' && '+ Create Dispatch (Outgoing)'}
          {active === 'misc' && '+ Create Material Store (Misc)'}
        </button>
      </div> */}

      {/* MODALS
      {showModal && active === 'incoming' && (
        <IncomingFormModal onClose={() => setShowModal(false)} />
      )}
      {showModal && active === 'outgoing' && (
        <OutgoingFormModal onClose={() => setShowModal(false)} />
      )}
      {showModal && active === 'misc' && <MiscFormModal onClose={() => setShowModal(false)} />} */}
    </div>
  );
}
