import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const data: Record<string, any> = {};
    
    // Process freelancer information
    data.name = formData.get('name');
    data.phone = formData.get('phone');
    data.address = formData.get('address');
    data.nif = formData.get('nif');
    data.stat = formData.get('stat');
    data.rcs = formData.get('rcs');
    data.email = formData.get('email');
    
    // Process invoice information
    data.invoiceNumber = formData.get('invoiceNumber');
    data.invoiceDate = formData.get('invoiceDate');
    
    // Process client information
    data.clientName = formData.get('clientName');
    data.clientAddress = formData.get('clientAddress');
    data.clientContact = formData.get('clientContact');
    data.clientEmail = formData.get('clientEmail');
    
    // Process services
    data.services = [];
    const serviceKeys = Array.from(formData.keys()).filter(key => key.startsWith('services['));
    
    const serviceIndices = new Set<number>();
    serviceKeys.forEach(key => {
      const match = key.match(/services\[(\d+)\]/);
      if (match) {
        serviceIndices.add(parseInt(match[1]));
      }
    });
    
    Array.from(serviceIndices).forEach(index => {
      const description = formData.get(`services[${index}].description`);
      const period = formData.get(`services[${index}].period`);
      const days = parseFloat(formData.get(`services[${index}].days`) as string || '0');
      const rate = parseFloat(formData.get(`services[${index}].rate`) as string || '0');
      
      data.services.push({
        description,
        period,
        days,
        rate,
        total: days * rate
      });
    });
    
    // Process additional information
    data.description = formData.get('description');
    data.discount = parseFloat(formData.get('discount') as string || '0');
    data.paymentMethod = formData.get('paymentMethod');
    data.dueDate = formData.get('dueDate');
    data.bankDetails = formData.get('bankDetails');
    
    // Calculate totals
    data.subtotal = data.services.reduce((sum: number, service: any) => sum + service.total, 0);
    data.total = data.subtotal - data.discount;
    
    // Store in cookies
    cookies.set('invoiceData', JSON.stringify(data), {
      path: '/',
      maxAge: 60 * 30 // 30 minutes
    });
    
    throw redirect(303, '/invoice/preview');
  }
}; 