import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px' }}>
        <p className="font-semibold text-black mb-2">{`${label}`}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: pld.color }}
            ></div>
            <span className="text-black">{`${pld.value}% ${pld.name}`}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const data = [
  { name: 'Sat', twitter: 35, facebook: 55, instagram: 45, linkedin: 24 },
  { name: 'Sun', twitter: 30, facebook: 50, instagram: 40, linkedin: 20 },
  { name: 'Mon', twitter: 25, facebook: 60, instagram: 30, linkedin: 22 },
  { name: 'Tue', twitter: 40, facebook: 52, instagram: 48, linkedin: 26 },
  { name: 'Wed', twitter: 35, facebook: 55, instagram: 45, linkedin: 24 },
  { name: 'Thu', twitter: 38, facebook: 50, instagram: 44, linkedin: 28 },
  { name: 'Fri', twitter: 32, facebook: 53, instagram: 42, linkedin: 25 },
  { name: 'Sat', twitter: 30, facebook: 48, instagram: 40, linkedin: 22 },
];

export default function EngagementChart({ height = 300 }: { height?: number }) {
  return (
    <div className="pt-2 px-6">
      <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 10 }}>
            {/* Remove grid and axis lines */}
            <CartesianGrid horizontal={true} vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} domain={[0, 65]} ticks={[0, 13, 26, 39, 52, 65]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12 }} width={40} />

            <Tooltip content={<CustomTooltip />} />

            {/* Social media lines */}
            <Line type="monotone" dataKey="twitter" stroke="#F4B400" strokeWidth={2} dot={false} name="X (Twitter)" />
            <Line type="monotone" dataKey="facebook" stroke="#1877F2" strokeWidth={2} dot={false} name="Facebook" />
            <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} dot={false} name="Instagram" />
            <Line type="monotone" dataKey="linkedin" stroke="#0A66C2" strokeWidth={2} dot={false} name="LinkedIn" />
          </LineChart>
      </ResponsiveContainer>
    </div>
  );
}