import { httpClient } from "../client/axios";

export type FormStatus =
  | "PENDING_BUDGET"
  | "BUDGET_SENT"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "DELIVERED";

export type FormData = {
  id: string;
  description: string;
  clientId: string;
  agencyId: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
  agency?: {
    id: string;
    name: string;
  };
  respondedByUser?: {
    id: string;
    name: string;
    email: string;
  } | null;
  respondedAt?: string | null;
  budgetValue?: string;
  budgetMessage?: string | null;
  deliveryStoredName?: string | null;
  deliveryFileName?: string | null;
  deliveryMimeType?: string | null;
  deliveryMessage?: string | null;
  paymentMethod?: string;
  rejectionReason?: string;
  agencyFeedback?: string;
  status: FormStatus;
  colors: Array<{ id: string; name: string; hexCode: string }>;
  createdAt: string;
  updatedAt: string;
};

type CreateFormPayload = {
  agencyId: string;
  description: string;
  colors?: Array<{ name: string; hexCode: string }>;
};

type SetFormBudgetPayload = {
  formId: string;
  budgetValue: string;
  /** Mensagem opcional ao cliente; envie null para limpar. */
  budgetMessage?: string | null;
};

type DecideFormBudgetPayload = {
  formId: string;
  approved: boolean;
  paymentMethod?: string;
  rejectionReason?: string;
};

type UpdateFormStatusPayload = {
  formId: string;
  status: "IN_PROGRESS" | "DELIVERED";
};

type RejectFormByAgencyPayload = {
  formId: string;
  feedback: string;
};

// Cliente - Criar formulário
export async function createForm(payload: CreateFormPayload) {
  const { data } = await httpClient.post<FormData>("/forms", payload);
  return data;
}

// Cliente - Listar seus formulários
export async function listClientForms() {
  const { data } = await httpClient.get<FormData[]>("/forms/my");
  return data;
}

// Cliente - Detalhe de uma solicitação (para acompanhamento)
export async function getClientForm(formId: string) {
  const { data } = await httpClient.get<FormData>(`/forms/my/${formId}`);
  return data;
}

// Cliente - Decidir sobre orçamento (aprovar/rejeitar)
export async function decideFormBudget(payload: DecideFormBudgetPayload) {
  const { data } = await httpClient.patch<FormData>(
    `/forms/${payload.formId}/decision`,
    {
      approved: payload.approved,
      paymentMethod: payload.paymentMethod,
      rejectionReason: payload.rejectionReason,
    },
  );
  return data;
}

// Cliente - Deletar formulário
export async function deleteForm(formId: string) {
  await httpClient.delete(`/forms/${formId}`);
}

// Agência - Listar formulários da agência
export async function listAgencyForms() {
  const { data } = await httpClient.get<FormData[]>("/agency/forms");
  return data;
}

// Agência - Definir orçamento
export async function setFormBudget(payload: SetFormBudgetPayload) {
  const body: { budgetValue: string; budgetMessage?: string | null } = {
    budgetValue: payload.budgetValue,
  };
  if (payload.budgetMessage !== undefined) {
    body.budgetMessage = payload.budgetMessage?.trim() || null;
  }
  const { data } = await httpClient.patch<FormData>(
    `/agency/forms/${payload.formId}/budget`,
    body,
  );
  return data;
}

// Agência - Atualizar status do formulário
export async function updateFormStatus(payload: UpdateFormStatusPayload) {
  const { data } = await httpClient.patch<FormData>(
    `/agency/forms/${payload.formId}/status`,
    { status: payload.status },
  );
  return data;
}

// Agência — entrega final (arquivo opcional + mensagem, status → DELIVERED)
export async function deliverFormFinal(payload: {
  formId: string;
  file?: File | null;
  deliveryMessage?: string | null;
}) {
  const fd = new FormData();
  if (payload.file) {
    fd.append("file", payload.file);
  }
  if (payload.deliveryMessage?.trim()) {
    fd.append("deliveryMessage", payload.deliveryMessage.trim());
  }

  const { data } = await httpClient.post<FormData>(
    `/agency/forms/${payload.formId}/deliver`,
    fd,
    {
      transformRequest: [
        (body, headers) => {
          if (body instanceof FormData) {
            delete headers["Content-Type"];
          }
          return body;
        },
      ],
    },
  );
  return data;
}

// Cliente — baixar arquivo de entrega (quando existir)
export async function downloadFormDeliveryFile(formId: string): Promise<{
  blob: Blob;
  filename: string;
}> {
  const response = await httpClient.get<Blob>(
    `/forms/my/${formId}/delivery-file`,
    {
      responseType: "blob",
    },
  );

  const cd = response.headers["content-disposition"];
  let filename = "entrega";
  if (typeof cd === "string") {
    const m = /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i.exec(cd);
    const raw = m?.[1] ?? m?.[2];
    if (raw) {
      try {
        filename = decodeURIComponent(raw.replace(/"/g, ""));
      } catch {
        filename = raw.replace(/"/g, "");
      }
    }
  }

  return { blob: response.data, filename };
}

// Agência — recusar solicitação (com motivo)
export async function rejectFormByAgency(payload: RejectFormByAgencyPayload) {
  const { data } = await httpClient.patch<FormData>(
    `/agency/forms/${payload.formId}/respond`,
    { feedback: payload.feedback },
  );
  return data;
}
