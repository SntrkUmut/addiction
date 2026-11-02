/**
 * Phosphor icons used by chapter pieces, teasers, and previews.
 * Deep imports keep the rest of the icon set out of the bundle.
 */

import React, { type ComponentType } from 'react';
import { Sparkle } from './icons';
import { Armchair } from 'phosphor-react-native/lib/module/icons/Armchair';
import { Binoculars } from 'phosphor-react-native/lib/module/icons/Binoculars';
import { Bird } from 'phosphor-react-native/lib/module/icons/Bird';
import { Boat } from 'phosphor-react-native/lib/module/icons/Boat';
import { BookOpenText } from 'phosphor-react-native/lib/module/icons/BookOpenText';
import { Books } from 'phosphor-react-native/lib/module/icons/Books';
import { Bridge } from 'phosphor-react-native/lib/module/icons/Bridge';
import { CloudSun } from 'phosphor-react-native/lib/module/icons/CloudSun';
import { Compass } from 'phosphor-react-native/lib/module/icons/Compass';
import { DoorOpen } from 'phosphor-react-native/lib/module/icons/DoorOpen';
import { Drop } from 'phosphor-react-native/lib/module/icons/Drop';
import { Feather } from 'phosphor-react-native/lib/module/icons/Feather';
import { Fish } from 'phosphor-react-native/lib/module/icons/Fish';
import { FlagBanner } from 'phosphor-react-native/lib/module/icons/FlagBanner';
import { FlowerLotus } from 'phosphor-react-native/lib/module/icons/FlowerLotus';
import { FlowerTulip } from 'phosphor-react-native/lib/module/icons/FlowerTulip';
import { Footprints } from 'phosphor-react-native/lib/module/icons/Footprints';
import { GridFour } from 'phosphor-react-native/lib/module/icons/GridFour';
import { Guitar } from 'phosphor-react-native/lib/module/icons/Guitar';
import { HouseSimple } from 'phosphor-react-native/lib/module/icons/HouseSimple';
import { Island } from 'phosphor-react-native/lib/module/icons/Island';
import { Lamp } from 'phosphor-react-native/lib/module/icons/Lamp';
import { LampPendant } from 'phosphor-react-native/lib/module/icons/LampPendant';
import { Leaf } from 'phosphor-react-native/lib/module/icons/Leaf';
import { Lightbulb } from 'phosphor-react-native/lib/module/icons/Lightbulb';
import { Lighthouse } from 'phosphor-react-native/lib/module/icons/Lighthouse';
import { MoonStars } from 'phosphor-react-native/lib/module/icons/MoonStars';
import { Mountains } from 'phosphor-react-native/lib/module/icons/Mountains';
import { MusicNotes } from 'phosphor-react-native/lib/module/icons/MusicNotes';
import { Park } from 'phosphor-react-native/lib/module/icons/Park';
import { Pinwheel } from 'phosphor-react-native/lib/module/icons/Pinwheel';
import { Planet } from 'phosphor-react-native/lib/module/icons/Planet';
import { Plant } from 'phosphor-react-native/lib/module/icons/Plant';
import { PottedPlant } from 'phosphor-react-native/lib/module/icons/PottedPlant';
import { Rainbow } from 'phosphor-react-native/lib/module/icons/Rainbow';
import { Sailboat } from 'phosphor-react-native/lib/module/icons/Sailboat';
import { ShootingStar } from 'phosphor-react-native/lib/module/icons/ShootingStar';
import { Snowflake } from 'phosphor-react-native/lib/module/icons/Snowflake';
import { Spiral } from 'phosphor-react-native/lib/module/icons/Spiral';
import { Star } from 'phosphor-react-native/lib/module/icons/Star';
import { Sun } from 'phosphor-react-native/lib/module/icons/Sun';
import { SunHorizon } from 'phosphor-react-native/lib/module/icons/SunHorizon';
import { TeaBag } from 'phosphor-react-native/lib/module/icons/TeaBag';
import { Tent } from 'phosphor-react-native/lib/module/icons/Tent';
import { Tree } from 'phosphor-react-native/lib/module/icons/Tree';
import { TreeEvergreen } from 'phosphor-react-native/lib/module/icons/TreeEvergreen';
import { Waves } from 'phosphor-react-native/lib/module/icons/Waves';
import { Yarn } from 'phosphor-react-native/lib/module/icons/Yarn';

type IconProps = { size?: number; color?: string; weight?: 'regular' | 'fill' };
type IconComponent = ComponentType<IconProps>;

const ICONS: Record<string, IconComponent> = {
  'armchair': Armchair,
  'binoculars': Binoculars,
  'bird': Bird,
  'boat': Boat,
  'book-open-text': BookOpenText,
  'books': Books,
  'bridge': Bridge,
  'cloud-sun': CloudSun,
  'compass': Compass,
  'door-open': DoorOpen,
  'drop': Drop,
  'feather': Feather,
  'fish': Fish,
  'flag-banner': FlagBanner,
  'flower-lotus': FlowerLotus,
  'flower-tulip': FlowerTulip,
  'footprints': Footprints,
  'grid-four': GridFour,
  'guitar': Guitar,
  'house-simple': HouseSimple,
  'island': Island,
  'lamp': Lamp,
  'lamp-pendant': LampPendant,
  'leaf': Leaf,
  'lightbulb': Lightbulb,
  'lighthouse': Lighthouse,
  'moon-stars': MoonStars,
  'mountains': Mountains,
  'music-notes': MusicNotes,
  'park': Park,
  'pinwheel': Pinwheel,
  'planet': Planet,
  'plant': Plant,
  'potted-plant': PottedPlant,
  'rainbow': Rainbow,
  'sailboat': Sailboat,
  'shooting-star': ShootingStar,
  'snowflake': Snowflake,
  'spiral': Spiral,
  'star': Star,
  'sun': Sun,
  'sun-horizon': SunHorizon,
  'tea-bag': TeaBag,
  'tent': Tent,
  'tree': Tree,
  'tree-evergreen': TreeEvergreen,
  'waves': Waves,
  'yarn': Yarn,
};

export function contentIcon(name: string | undefined | null): IconComponent {
  if (name && ICONS[name]) return ICONS[name];
  return Sparkle;
}

export function ContentIcon({
  name,
  size,
  color,
  weight = 'regular',
}: {
  name?: string | null;
  size?: number;
  color?: string;
  weight?: 'regular' | 'fill';
}) {
  return React.createElement(contentIcon(name), { size, color, weight });
}
