'use client';

import Image from 'next/image';

interface IconInfo {
  name: string;
  path: string;
}

interface ResourceIconGalleryProps {
  onSelectIcon: (iconPath: string, iconName: string) => void;
  selectedPath?: string;
  onDeselect?: () => void;
}

const icons: IconInfo[] = [
  { name: 'CAD', path: '/ResourceIcon/Cad.svg' },
  { name: 'File', path: '/ResourceIcon/File .svg' },
  { name: 'Poster', path: '/ResourceIcon/Poster.svg' },
  { name: 'SketchUp', path: '/ResourceIcon/SketchUp.svg' },
  { name: 'PDF', path: '/ResourceIcon/PDF.svg' },
  { name: 'URL', path: '/ResourceIcon/Url.svg' },
  { name: 'Picture', path: '/ResourceIcon/Picture.svg' },
  { name: 'PowerPoint', path: '/ResourceIcon/PowerPoint.svg' },
  { name: 'GitHub', path: '/ResourceIcon/Github.svg' },
  { name: 'YouTube', path: '/ResourceIcon/Youtube.svg' },
];

const ResourceIconGallery: React.FC<ResourceIconGalleryProps> = ({ onSelectIcon, selectedPath, onDeselect }) => {
  const handleIconClick = (icon: IconInfo) => {
    if (selectedPath === icon.path && onDeselect) {
      onDeselect();
    } else {
      onSelectIcon(icon.path, icon.name);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-2">
        {icons.map((icon) => (
          <div
            key={icon.name}
            onClick={() => handleIconClick(icon)}
            className={`flex flex-col items-center justify-center p-2 bg-white rounded hover:bg-gray-50 transition-all duration-200 cursor-pointer
              ${selectedPath === icon.path ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
            `}
          >
            <div className="relative w-8 h-8">
              <Image
                src={icon.path}
                alt={`${icon.name} icon`}
                fill
                className="object-contain"
              />
            </div>
            <span className="mt-1 text-xs text-gray-600 text-center truncate w-full">{icon.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceIconGallery;