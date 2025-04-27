<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div class="container mx-auto flex flex-col items-center justify-center min-h-screen gap-6 py-12">
  <div class="text-center space-y-3">
    <h1 class="text-4xl font-bold">Factureo</h1>
    <p class="text-xl text-muted-foreground">Générez facilement vos factures professionnelles</p>
    <p class="max-w-md mx-auto">Une application simple pour les freelances malgaches qui souhaitent créer rapidement des factures conformes.</p>
  </div>
  
  <div class="w-full max-w-sm p-6 rounded-lg border shadow-sm bg-card">
    <div class="space-y-4">
      <div class="space-y-2">
        <h2 class="text-2xl font-semibold tracking-tight">Créez une nouvelle facture</h2>
        <p class="text-sm text-muted-foreground">
          Remplissez le formulaire avec les informations nécessaires pour générer votre facture.
        </p>
      </div>
      <div class="flex justify-center">
        <Button href="/invoice/create" class="w-full">Démarrer</Button>
      </div>
    </div>
  </div>
</div>
