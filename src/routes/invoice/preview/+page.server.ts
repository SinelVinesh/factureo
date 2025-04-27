import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
  const formData = cookies.get('invoiceData');
  
  if (!formData) {
    throw redirect(303, '/invoice/create');
  }
  
  return {
    invoiceData: JSON.parse(formData)
  };
}; 