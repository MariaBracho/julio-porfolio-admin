import { Button } from "../ui/button";

interface Props {
  editCallback?: () => void;
  deleteCallback?: () => void;
  row: any;
}

export default function Action({ editCallback, deleteCallback, row }: Props) {
  return (
    <div className="flex gap-2 justify-end">
      <Button variant="destructive" onClick={deleteCallback}>
        Eliminar
      </Button>
      <Button onClick={editCallback}>Editar</Button>
    </div>
  );
}
