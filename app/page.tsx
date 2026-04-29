import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

type Todo = {
  id: string;
  name: string;
};

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase
    .from("todos")
    .select("id, name")
    .overrideTypes<Todo[], { merge: false }>();

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}
