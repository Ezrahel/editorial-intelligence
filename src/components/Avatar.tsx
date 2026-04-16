interface AvatarProps {
  name: string;
  className?: string;
  variant?: 'emerald' | 'amber' | 'coral' | 'teal' | 'plum' | 'blue';
}

const variantImages: Record<
  NonNullable<AvatarProps['variant']>,
  {
    src: string;
    position: string;
  }
> = {
  emerald: {
    src: 'https://images.pexels.com/photos/6874748/pexels-photo-6874748.jpeg?cs=srgb&dl=pexels-gideon-hezekiah-29104819-6874748.jpg&fm=jpg',
    position: 'center 24%',
  },
  amber: {
    src: 'https://images.pexels.com/photos/18870800/pexels-photo-18870800.jpeg?cs=srgb&dl=pexels-evani-760821126-18870800.jpg&fm=jpg',
    position: 'center 18%',
  },
  coral: {
    src: 'https://images.pexels.com/photos/14471498/pexels-photo-14471498.jpeg?cs=srgb&dl=pexels-krivitskiy-14471498.jpg&fm=jpg',
    position: 'center 16%',
  },
  teal: {
    src: 'https://images.pexels.com/photos/17612326/pexels-photo-17612326.jpeg?cs=srgb&dl=pexels-ali-drabo-10956272-17612326.jpg&fm=jpg',
    position: 'center 22%',
  },
  plum: {
    src: 'https://images.pexels.com/photos/17300043/pexels-photo-17300043.jpeg?cs=srgb&dl=pexels-bave-pictures-64453798-17300043.jpg&fm=jpg',
    position: 'center 18%',
  },
  blue: {
    src: 'https://images.pexels.com/photos/23801235/pexels-photo-23801235.jpeg?cs=srgb&dl=pexels-socrates-531352838-23801235.jpg&fm=jpg',
    position: 'center 18%',
  },
};

export default function Avatar({
  name,
  className = '',
  variant = 'emerald',
}: AvatarProps) {
  const image = variantImages[variant];

  return (
    <div
      aria-label={name}
      title={name}
      className={`overflow-hidden bg-zinc-100 ${className}`}
    >
      <img
        src={image.src}
        alt={name}
        className="w-full h-full object-cover"
        style={{ objectPosition: image.position }}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    </div>
  );
}
