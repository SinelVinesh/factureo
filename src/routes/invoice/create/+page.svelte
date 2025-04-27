<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Separator } from "$lib/components/ui/separator";
  import { enhance } from "$app/forms";

  // Default values for the form
  let services = [{ 
    description: "Développement web", 
    period: "1 au 10 juin 2025", 
    days: 10, 
    rate: 150000 
  }];
  
  // Default data
  let freelancer = {
    name: "Rakoto Jean",
    phone: "+261340000000",
    address: "Lot II A 34 Bis Analamahintsy, Antananarivo 101",
    nif: "1234567890",
    stat: "12345678901234",
    rcs: "2023 A 12345",
    email: "rakoto.jean@email.com"
  }
  
  let invoice = {
    number: "2025-001",
    date: new Date().toISOString().split('T')[0]
  }
  
  let client = {
    name: "Société ABC",
    address: "Lot IVK 77 Ter Ambohimanarina, Antananarivo 101",
    contact: "+261331111111",
    email: "contact@abc.mg"
  }
  
  let payment = {
    method: "Virement bancaire",
    dueDate: "30 jours après facturation",
    bankDetails: "BNI Madagascar - 00000 00000 00000000000 00"
  }
  
  function addService() {
    services = [...services, { description: "", period: "", days: 1, rate: 0 }];
  }
  
  function removeService(index: number) {
    services = services.filter((_, i) => i !== index);
  }
</script>

<div class="container mx-auto py-10">
  <div class="space-y-6 max-w-4xl mx-auto">
    <div>
      <h1 class="text-3xl font-bold">Créer une nouvelle facture</h1>
      <p class="text-muted-foreground">Remplissez le formulaire ci-dessous pour générer votre facture.</p>
    </div>

    <form method="POST" use:enhance>
      <div class="space-y-8">
        <!-- Information sur le freelance -->
        <Card>
          <CardHeader>
            <CardTitle>Vos informations</CardTitle>
            <CardDescription>Informations qui apparaîtront en entête de facture</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="name">Nom et Prénom</Label>
                <Input id="name" name="name" value={freelancer.name} required />
              </div>
              <div class="space-y-2">
                <Label for="phone">Téléphone</Label>
                <Input id="phone" name="phone" value={freelancer.phone} />
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="address">Adresse complète</Label>
              <Textarea id="address" name="address" rows={2} value={freelancer.address} />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label for="nif">NIF</Label>
                <Input id="nif" name="nif" value={freelancer.nif} />
              </div>
              <div class="space-y-2">
                <Label for="stat">STAT</Label>
                <Input id="stat" name="stat" value={freelancer.stat} />
              </div>
              <div class="space-y-2">
                <Label for="rcs">RCS</Label>
                <Input id="rcs" name="rcs" value={freelancer.rcs} />
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" name="email" type="email" value={freelancer.email} />
            </div>
          </CardContent>
        </Card>
        
        <!-- Informations sur la facture -->
        <Card>
          <CardHeader>
            <CardTitle>Informations de la facture</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="invoiceNumber">Numéro de facture</Label>
                <Input id="invoiceNumber" name="invoiceNumber" placeholder="ex: 2025-001" value={invoice.number} required />
              </div>
              <div class="space-y-2">
                <Label for="invoiceDate">Date d'émission</Label>
                <Input id="invoiceDate" name="invoiceDate" type="date" value={invoice.date} required />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <!-- Information sur le client -->
        <Card>
          <CardHeader>
            <CardTitle>Informations du client</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="clientName">Nom du client ou entreprise</Label>
              <Input id="clientName" name="clientName" value={client.name} required />
            </div>
            
            <div class="space-y-2">
              <Label for="clientAddress">Adresse du client</Label>
              <Textarea id="clientAddress" name="clientAddress" rows={2} value={client.address} />
            </div>
            
            <div class="space-y-2">
              <Label for="clientContact">Contact (Tél / Email)</Label>
              <Input id="clientContact" name="clientContact" value={client.contact} />
            </div>
          </CardContent>
        </Card>
        
        <!-- Détails des prestations -->
        <Card>
          <CardHeader>
            <CardTitle>Détails des prestations</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            {#each services as service, i}
              <div class="space-y-4">
                {#if i > 0}
                  <Separator />
                {/if}
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for={`service-${i}-description`}>Description de la prestation</Label>
                    <Input id={`service-${i}-description`} name={`services[${i}].description`} bind:value={service.description} placeholder="ex: Développement web" required />
                  </div>
                  <div class="space-y-2">
                    <Label for={`service-${i}-period`}>Période</Label>
                    <Input id={`service-${i}-period`} name={`services[${i}].period`} bind:value={service.period} placeholder="ex: 10 au 15 avril 2025" />
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="space-y-2">
                    <Label for={`service-${i}-days`}>Nombre de jours</Label>
                    <Input id={`service-${i}-days`} name={`services[${i}].days`} type="number" bind:value={service.days} min="0.5" step="0.5" />
                  </div>
                  <div class="space-y-2">
                    <Label for={`service-${i}-rate`}>Prix Unitaire / Jour (Ar)</Label>
                    <Input id={`service-${i}-rate`} name={`services[${i}].rate`} type="number" bind:value={service.rate} min="0" step="1000" />
                  </div>
                  <div class="space-y-2">
                    <Label>Total (Ar)</Label>
                    <div class="h-10 px-4 py-2 border rounded-md text-right">
                      {new Intl.NumberFormat('fr-MG').format(service.days * service.rate)}
                    </div>
                  </div>
                </div>
                
                {#if i > 0 || services.length > 1}
                  <div class="flex justify-end">
                    <Button type="button" variant="destructive" on:click={() => removeService(i)} class="px-2 h-8">
                      Supprimer
                    </Button>
                  </div>
                {/if}
              </div>
            {/each}
            
            <Button type="button" variant="outline" on:click={addService} class="w-full mt-2">
              Ajouter une prestation
            </Button>
          </CardContent>
        </Card>
        
        <!-- Description complémentaire -->
        <Card>
          <CardHeader>
            <CardTitle>Description complémentaire</CardTitle>
            <CardDescription>Informations supplémentaires à ajouter à la facture</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Textarea id="description" name="description" rows={3} placeholder="Description détaillée de la prestation si besoin" value="Développement d'une application web complète incluant le frontend et le backend." />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="discount">Remise (Ar)</Label>
                <Input id="discount" name="discount" type="number" min="0" step="1000" value="100000" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <!-- Modalités de paiement -->
        <Card>
          <CardHeader>
            <CardTitle>Modalités de paiement</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="paymentMethod">Mode de paiement</Label>
                <Input id="paymentMethod" name="paymentMethod" placeholder="ex: Espèces, virement bancaire, Mobile Money, etc." value={payment.method} />
              </div>
              <div class="space-y-2">
                <Label for="dueDate">Date limite de paiement</Label>
                <Input id="dueDate" name="dueDate" placeholder="ex: 30 jours après facturation" value={payment.dueDate} />
              </div>
            </div>
            
            <div class="space-y-2">
              <Label for="bankDetails">Compte bancaire / Mobile Money</Label>
              <Input id="bankDetails" name="bankDetails" placeholder="Coordonnées bancaires ou téléphone" value={payment.bankDetails} />
            </div>
          </CardContent>
        </Card>
        
        <div class="flex justify-end">
          <Button type="submit" class="w-full md:w-auto">Prévisualiser la facture</Button>
        </div>
      </div>
    </form>
  </div>
</div> 