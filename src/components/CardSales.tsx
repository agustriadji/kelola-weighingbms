import Badge from './Badge';

type ClientsProps = {
    name: string;
    industry: string;
    contact: string;
}

type CardSalesProps = {
  id: number;
  name: string;
  role: string;
  region: string;
  skills: string[];
  clients: ClientsProps[]
};

export default function CardSales({ id, name, role, region, skills, clients }: CardSalesProps) {
  return (
    <div key={id || 1}>
        <h2 className="font-semibold">
            {name} - {role}
        </h2>
        <p className="text-gray-600 text-xs">{region}</p>
        <div className="mt-3">
            <p className="text-sm font-medium">Skills:</p>
            <div className="flex gap-2 mt-1">
                {skills.map((skill) => (
                <span key={skill} className="bg-gray-200 px-2 py-1 rounded text-xs">
                    {skill}
                </span>
                ))}
            </div>
        </div>
        <div className="mt-3">
            <p className="text-sm font-medium">Clients:</p>
            <div className="flex gap-2 mt-1">
                {clients.map((client,index) => (
                <Badge key={index} text={client.name} color={`bg-red-400`} />
                ))}
            </div>
        </div>
    </div>
  )
}
