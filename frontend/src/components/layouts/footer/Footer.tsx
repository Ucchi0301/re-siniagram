import { AiFillHome } from 'react-icons/ai'
import { MdAddCircle, MdAccountCircle } from 'react-icons/md'

const Footer = () => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='flex w-full h-full items-center max-w-md justify-between px-6'>
        <FooterItem icon={<AiFillHome size={40} />} label='ホーム' />
        <FooterItem icon={<MdAddCircle size={40} />} label='投稿' />
        <FooterItem icon={<MdAccountCircle size={40} />} label='アカウント' />
      </div>
    </div>
  )
}


const FooterItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => {
  return (
    <div className='w-20 flex flex-col items-center text-gray-700 hover:text-black cursor-pointer'>
      <div className='mb-1'>{icon}</div>
      <span className='text-sm leading-none'>{label}</span>
    </div>
  )
}

export default Footer
