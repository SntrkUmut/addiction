/**
 * Day milestones (1/7/14/30/60/90) plus kayma copy.
 * A slip never resets journey days; it only switches the copy variant.
 */

export type MilestoneCopy = {
  key: `day-${number}`;
  day: number;
  eyebrow: string;
  lead: string;
  body: string;
  slipEyebrow: string;
  slipLead: string;
  slipBody: string;
  reward?: string;
};

export const DAY_MILESTONES: MilestoneCopy[] = [
  {
    key: 'day-1',
    day: 1,
    eyebrow: 'İLK GÜN',
    lead: 'İlk günü geride bıraktın.',
    body: 'Bir başlangıç yaptın ve bugün buradasın. Attığın her küçük adım burada duruyor.',
    slipEyebrow: 'YOLA ÇIKTIN',
    slipLead: 'İlk günün geride kaldı.',
    slipBody: 'Bugün kolay geçmemiş olabilir; bu da yolun bir parçası. Burada olman yeterli bir adım.',
  },
  {
    key: 'day-7',
    day: 7,
    eyebrow: 'BİR HAFTA OLDU',
    lead: 'Bir haftadır kendine alan açıyorsun.',
    body: 'Yedi gün boyunca küçük adımlar attın. Sığınağın da seninle birlikte büyüyor.',
    slipEyebrow: 'YOLCULUĞUN DEVAM EDİYOR',
    slipLead: 'Bir haftadır bu yoldasın.',
    slipBody: 'Kaymalar oldu ama yolun kesilmedi. Her yeniden başlayış da sayılır.',
  },
  {
    key: 'day-14',
    day: 14,
    eyebrow: 'İKİ HAFTA OLDU',
    lead: 'İki haftadır kendi ritmini buluyorsun.',
    body: 'Zor anlarda bile bir sonraki küçük adımı seçtin. Bu birikim senin.',
    slipEyebrow: 'YOLCULUĞUN DEVAM EDİYOR',
    slipLead: 'İki haftadır bu yoldasın.',
    slipBody: 'Bazı günler daha zor geçti; yine de buradasın. Açtığın hiçbir ışık sönmedi.',
  },
  {
    key: 'day-30',
    day: 30,
    eyebrow: 'BİR AY OLDU',
    lead: 'Otuz gün boyunca kendine alan açtın.',
    body: 'Her gün küçük bir adım attın ve bu adımlar birikti. Bugün durup bunu fark etmeye değer.',
    slipEyebrow: 'YOLCULUĞUN DEVAM EDİYOR',
    slipLead: '30 gündür bu yoldasın.',
    slipBody: 'Yol boyunca kaymalar da oldu; hiçbiri kurduğun şeyi silmedi. Önemli olan, her seferinde yeniden devam etmen.',
  },
  {
    key: 'day-60',
    day: 60,
    eyebrow: 'İKİ AY OLDU',
    lead: 'İki aydır kendine alan açıyorsun.',
    body: 'Altmış gün boyunca attığın her küçük adım burada duruyor.',
    slipEyebrow: 'YOLCULUĞUN DEVAM EDİYOR',
    slipLead: 'İki aydır bu yoldasın.',
    slipBody: 'Kolay ve zor günler oldu; hiçbiri kurduğun şeyi silmedi.',
    reward: 'it-aytasi',
  },
  {
    key: 'day-90',
    day: 90,
    eyebrow: 'ÜÇ AY OLDU',
    lead: 'Üç aydır bu yolu kendin için seçiyorsun.',
    body: 'Doksan günün emeği burada, seninle. Sığınağın da bu sürede seninle büyüdü.',
    slipEyebrow: 'YOLCULUĞUN DEVAM EDİYOR',
    slipLead: 'Üç aydır bu yoldasın.',
    slipBody: 'Bu doksan günde zor anlar da oldu; hiçbiri attığın adımları silmedi.',
    reward: 'it-akuamarin',
  },
];

export function milestoneByDay(day: number): MilestoneCopy | undefined {
  return DAY_MILESTONES.find(item => item.day === day);
}

/**
 * Show only the latest unseen milestone that has already been reached.
 * Opening late (e.g. day 9) shows 7, not 1 then 7.
 */
export function latestUnseenMilestone(
  journeyDays: number,
  seenKeys: readonly string[],
): MilestoneCopy | null {
  const seen = new Set(seenKeys);
  const reached = DAY_MILESTONES.filter(item => journeyDays >= item.day);
  if (reached.length === 0) return null;
  const latest = reached[reached.length - 1];
  if (seen.has(latest.key)) return null;
  return latest;
}

export function resolveMilestoneCopy(milestone: MilestoneCopy, slipped: boolean) {
  return {
    eyebrow: slipped ? milestone.slipEyebrow : milestone.eyebrow,
    lead: slipped ? milestone.slipLead : milestone.lead,
    body: slipped ? milestone.slipBody : milestone.body,
    day: milestone.day,
    key: milestone.key,
  };
}
