<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import { Separator } from "$lib/components/ui/separator";
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  
  export let data;
  
  const { invoiceData } = data;
  
  let invoiceElement: HTMLElement | null = null;
  let generating = false;
  
  function formatNumber(num: number) {
    return new Intl.NumberFormat('fr-MG').format(num);
  }
  
  async function generatePDF() {
    if (!invoiceElement) return;
    
    generating = true;
    
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`facture-${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF.');
    }
    
    generating = false;
  }
</script>

<div class="container mx-auto py-10">
  <div class="space-y-6 max-w-4xl mx-auto">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Aperçu de la facture</h1>
      <div class="flex gap-4">
        <Button href="/invoice/create" variant="outline">Modifier</Button>
        <Button on:click={generatePDF} disabled={generating}>
          {generating ? 'Génération en cours...' : 'Générer PDF'}
        </Button>
      </div>
    </div>
    
    <div bind:this={invoiceElement}>
      <Card class="p-8 border-2 print:border-0 shadow-none text-black bg-white">
        <!-- Header -->
        <div class="text-center text-2xl font-bold mb-6">FACTURE</div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <!-- Freelancer Info -->
          <div>
            <p><span class="font-semibold">Dénomination Sociale :</span> {invoiceData.name || '[Votre Nom et Prénom]'}</p>
            <p><span class="font-semibold">Adresse :</span> {invoiceData.address || '[Votre adresse complète]'}</p>
            <p><span class="font-semibold">NIF :</span> {invoiceData.nif || '[Votre numéro NIF]'}</p>
            <p><span class="font-semibold">STAT :</span> {invoiceData.stat || '[Votre numéro STAT]'}</p>
            <p><span class="font-semibold">RCS :</span> {invoiceData.rcs || '[Votre numéro RCS]'}</p>
            <p><span class="font-semibold">Tél :</span> {invoiceData.phone || '[Votre numéro de téléphone]'}</p>
            <p><span class="font-semibold">Email :</span> {invoiceData.email || '[Votre adresse email]'}</p>
          </div>
          
          <!-- Invoice Info & Client -->
          <div>
            <p><span class="font-semibold">FACTURE N° :</span> {invoiceData.invoiceNumber || '[Numéro de la facture]'}</p>
            <p><span class="font-semibold">Date d'émission :</span> {invoiceData.invoiceDate || '[Date de la facture]'}</p>
            <div class="mt-4">
              <p class="font-semibold">Client :</p>
              <p>{invoiceData.clientName || '[NOM DU CLIENT ou ENTREPRISE]'}</p>
              <p>{invoiceData.clientAddress || '[Adresse du client]'}</p>
              <p>Tél : {invoiceData.clientContact || '[Téléphone du client]'}</p>
              <p>Email : {invoiceData.clientEmail || '[Email du client]'}</p>
            </div>
          </div>
        </div>
        
        <Separator class="my-6" />
        
        <!-- Services -->
        <div class="mb-6">
          <p class="font-semibold mb-4">Détail de la prestation par période travaillée :</p>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border p-2 text-left">Prestation</th>
                  <th class="border p-2 text-left">Période</th>
                  <th class="border p-2 text-left">Nombre de jours</th>
                  <th class="border p-2 text-left">Prix Unitaire / Jour (Ar)</th>
                  <th class="border p-2 text-left">Total (Ar)</th>
                </tr>
              </thead>
              <tbody>
                {#each invoiceData.services as service}
                  <tr>
                    <td class="border p-2">{service.description}</td>
                    <td class="border p-2">{service.period}</td>
                    <td class="border p-2">{service.days}</td>
                    <td class="border p-2">{formatNumber(service.rate)}</td>
                    <td class="border p-2">{formatNumber(service.total)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Description -->
        {#if invoiceData.description}
          <div class="mb-6">
            <p class="font-semibold mb-2">Description complémentaire :</p>
            <p>{invoiceData.description}</p>
          </div>
        {/if}
        
        <Separator class="my-6" />
        
        <!-- Totals -->
        <div class="mb-6">
          <p class="font-semibold mb-4">Montant Total :</p>
          <div class="w-full md:w-1/2 ml-auto">
            <div class="grid grid-cols-2 gap-2">
              <div class="font-semibold">Sous-total</div>
              <div class="text-right">{formatNumber(invoiceData.subtotal)} Ar</div>
              
              {#if invoiceData.discount > 0}
                <div class="font-semibold">Remise</div>
                <div class="text-right">{formatNumber(invoiceData.discount)} Ar</div>
              {/if}
              
              <div class="font-semibold text-lg">Total Net à Payer</div>
              <div class="text-right font-bold text-lg">{formatNumber(invoiceData.total)} Ar</div>
            </div>
          </div>
        </div>
        
        <Separator class="my-6" />
        
        <!-- Payment Info -->
        <div class="mb-6">
          <p class="font-semibold mb-4">Modalités de paiement :</p>
          <p><span class="font-semibold">Mode de paiement :</span> {invoiceData.paymentMethod || '[Espèces, virement bancaire, Mobile Money, etc.]'}</p>
          <p><span class="font-semibold">Date limite de paiement :</span> {invoiceData.dueDate || '[Exemple : 30 jours après facturation]'}</p>
          <p><span class="font-semibold">Compte bancaire / Mobile Money :</span> {invoiceData.bankDetails || '[Coordonnées bancaires ou téléphone]'}</p>
        </div>
        
        <!-- Legal Mentions -->
        <div class="mt-10 text-sm">
          <p>Mentions légales facultatives :</p>
          <p>"Exonéré de TVA selon l'article 06.01.04 du Code Général des Impôts"</p>
          <p>"Tout retard de paiement entraînera des pénalités calculées au taux d'intérêt légal en vigueur à Madagascar, conformément aux dispositions du Code civil malgache."</p>
        </div>
        
        <div class="mt-10 text-center font-semibold">
          <p>Merci pour votre confiance !</p>
        </div>
      </Card>
    </div>
  </div>
</div> 