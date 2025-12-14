import Image from 'next/image';

export default function LogoHeaderShared() {
  return (
    <div className="flex items-center">
      <Image src="/logo.png" alt="Evyap" width={120} height={60} />
      <div className="ml-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
        Life Chemistry
      </div>
    </div>
  );
}
